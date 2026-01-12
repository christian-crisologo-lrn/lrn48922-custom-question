export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      console.log(`Script already loaded: ${src}`);
      resolve();
      return;
    }

    console.log(`Loading script: ${src}`);

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      console.log(`Script loaded: ${src}`);
      resolve();
    };

    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`);
      console.error(error);
      reject(error);
    };

    document.body.appendChild(script);
  });
}
