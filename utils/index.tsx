import React, { useEffect, useState, useRef } from 'react';

interface ReCaptchaProps {
  sitekey: string;
  callback: (response: string) => void;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ sitekey, callback }) => {
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState<boolean>(false);

  const onloadCallback = () => {
    setIsRecaptchaLoaded(true);
  };

  useEffect(() => {
    (window as any).onloadCallback = onloadCallback;

    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && window.grecaptcha.render) {
      setIsRecaptchaLoaded(true);
    }

    return () => {
      (window as any).onloadCallback = null;
    };
  }, []);

  useEffect(() => {
    if (isRecaptchaLoaded && recaptchaRef.current) {
      window.grecaptcha.render(recaptchaRef.current, {
        'sitekey': sitekey,
        size: 'invisible',
        badge: 'inline',
        'callback': callback,
      });
    }
  }, [isRecaptchaLoaded, sitekey, callback]);

  return (
    <div>
      <div ref={recaptchaRef} />
      {!isRecaptchaLoaded && <p>Loading...</p>}
    </div>
  );
};

export default ReCaptcha;
