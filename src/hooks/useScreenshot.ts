import { useEffect, useState } from 'react';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import format from 'date-fns/format';

function useScreenCapture() {
  const [image, takeScreenshot] = useScreenshot();
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const date = new Date();

  const download = (image, { name = 'img', extension = 'png' } = {}) => {
    if (image) {
      const a = document.createElement('a');
      a.href = image;
      a.download = createFileName(extension, name);
      a.click();
    }
  };

  const getImage = (imageType: string, ref) => {
    setIsLoading(true);
    takeScreenshot(ref.current);
    setFileName(imageType);
  };

  useEffect(() => {
    if (image) {
      download(image, {
        name: `${fileName}-${format(date, 'dd.MM.yyyy HH:mm:ss')}`,
        extension: 'jpeg'
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [image]);

  return { getImage, isLoading };
}
export default useScreenCapture;
