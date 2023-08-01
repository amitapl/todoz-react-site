export function debounce(thisObj: any, wait: number, func: Function) {
  let timeout: number | null;
  return (...args: any) => {
    console.log("timeout " + timeout);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(thisObj, args);
    }, wait);
  };
}
