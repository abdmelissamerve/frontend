import { isIPv4, isIPv6 } from 'is-ip';

function isValid4(ip: string): Object {
  if (!ip || ip.length === 0) {
    return false;
  }

  const checkIPv4 = isIPv4(ip);
  if (checkIPv4) {
    return true;
  }

  return false;
}

function isValid6(ip: string): Object {
  if (!ip || ip.length === 0) {
    return false;
  }

  const checkIPv6 = isIPv6(ip);
  if (checkIPv6) {
    return true;
  }

  return false;
}

export { isValid4, isValid6 };
