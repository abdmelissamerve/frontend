import { useState } from 'react';
import * as workerService from 'src/services/workers';
import { Worker } from 'src/models/workers';

const DEPLOY_BATCH_SIZE = 10;

interface DeployResponse {
  workerId: number;
  status: 'OK' | 'ERROR' | 'TIMEOUT';
  log: string;
}

interface DeployWorkersHook {
  deploy: () => Promise<void>;
  stop: () => Promise<void>;
  retryFailed: () => Promise<void>;
  error: string;
  startTime: Date;
  progress: number;
  progressPercentage: number;
  workerCount: number;
  successCount: number;
  failureCount: number;
  isDeploying: boolean;
  deployResponse: DeployResponse[];
}

export const useDeployWorkers = (): DeployWorkersHook => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [workerCount, setWorkerCount] = useState(0);
  const [deployResponse, setDeployResponse] = useState([]);
  const [error, setError] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failedWorkers, setFailedWorkers] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const deployWorker = async (workerId: number): Promise<DeployResponse> => {
    const data: DeployResponse = {
      workerId: workerId,
      status: 'OK',
      log: ''
    };

    try {
      const response = await workerService.deployWorker(workerId);
      // await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      data.log = err.data;

      switch (err.kind) {
        case 'rejected':
          data.status = 'ERROR';
          console.error(err);
          break;

        case 'timeout':
          data.status = 'TIMEOUT';
          break;

        case 'cannot-connect':
          data.status = 'ERROR';
          data.log = 'Cannot connect (Status: 504)';
          break;

        default:
          data.status = 'ERROR';
          console.error(err);
          break;
      }
    }

    return data;
  };

  const deployBatch = async (items: Worker[]): Promise<void> => {
    const promises = items.map(async (worker: Worker): Promise<void> => {
      const data = await deployWorker(worker.id);

      if (data.status === 'OK') {
        setSuccessCount((prevState) => prevState + 1);
      } else {
        setFailedWorkers((prevState) => [...prevState, worker]);
      }

      setDeployResponse((prevData) => [
        ...prevData,
        { worker: worker, ...data }
      ]);
    });

    await Promise.all(promises);
  };

  const deployAll = async (): Promise<void> => {
    try {
      const response = await workerService.getWorkers({
        limit: 1000
      });
      await deploy(response.workers);
    } catch (err) {
      console.error(err);
      setIsDeploying(false);
      setError('Cannot fetch workers to deploy');
      return;
    }
  };

  const retryFailed = async (): Promise<void> => {
    await deploy(failedWorkers);
  };

  const deploy = async (workers: Worker[]): Promise<void> => {
    setSuccessCount(0);
    setFailedWorkers([]);
    setDeployResponse([]);
    setIsDeploying(true);
    setError(null);
    setWorkerCount(0);
    setStartTime(new Date());
    setWorkerCount(workers.length);

    for (let i = 0; i < workers.length; i += DEPLOY_BATCH_SIZE) {
      const batch = workers.slice(i, i + DEPLOY_BATCH_SIZE);
      await deployBatch(batch);
    }

    setIsDeploying(false);
  };

  const stopDeployment = () => {
    if (!isDeploying) return;

    // todo cancel axios calls
  };

  const failureCount = failedWorkers.length;
  const progress = successCount + failureCount;
  const progressPercentage =
    workerCount > 0 ? Math.round((100 / workerCount) * progress) : 0;

  return {
    deploy: deployAll,
    stop: stopDeployment,
    isSuccessful: progressPercentage === 100,
    startTime,
    successCount,
    retryFailed,
    failureCount,
    error,
    progressPercentage,
    workerCount,
    progress,
    isDeploying,
    deployResponse
  };
};
