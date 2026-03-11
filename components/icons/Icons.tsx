import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 17.5c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5c1.46 0 2.8.57 3.82 1.5H12v2h5.58c-.1-1.15-.59-2.2-1.28-3.08A5.47 5.47 0 0 0 12 6.5C8.97 6.5 6.5 8.97 6.5 12s2.47 5.5 5.5 5.5c1.76 0 3.37-.83 4.4-2.18l-1.57-1.23c-.7.86-1.73 1.41-2.83 1.41z"/>
    </svg>
);

export const PlantMonitorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-2.066 0-3.75 1.684-3.75 3.75s1.684 3.75 3.75 3.75 3.75-1.684 3.75-3.75S14.066 8.25 12 8.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.966 8.966 0 01-5.973-2.253 8.966 8.966 0 01-2.253-5.973C3.77 7.29 7.29 3.77 12 3.77s8.23 3.52 8.23 8.23a8.966 8.966 0 01-2.253 5.973A8.966 8.966 0 0112 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75V21m0-17.25v5.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12H3m18 0h-5.25" />
    </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const CropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.879l-1.414-1.414L15 12l-2.293-2.293 1.414-1.414L17.828 12l-3.707 3.879zM9.879 8.121L8.464 9.536 6 12l2.464 2.464 1.415-1.415L8.586 12l1.293-1.293z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

export const FertilizerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10s5 2 5 2a8 8 0 013.657 6.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.343 17.657A8 8 0 0118.657 9.343S17 11 15 12s-5-2-5-2a8 8 0 00-3.657-6.657z" />
  </svg>
);

export const PestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const WeatherIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.5 4.5 0 002.25 15z" />
    </svg>
);


export const YieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const SustainabilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21.121 12.121a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21V12" />
  </svg>
);

export const WaterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.828a4 4 0 010-5.656m5.656 0a4 4 0 010 5.656" />
  </svg>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


export const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const TemperatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12s4.03 8.25 9 8.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V3M12 12.75a2.25 2.25 0 01-2.25-2.25" />
    </svg>
);

export const HumidityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.116 0-9.25 3.32-9.25 7.419 0 2.53 1.259 4.81 3.25 6.22V21h12v-5.111c1.991-1.41 3.25-3.69 3.25-6.22C21.25 5.57 17.116 2.25 12 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a2.25 2.25 0 002.25-2.25H9.75A2.25 2.25 0 0012 15.75z" />
    </svg>
);

export const RainfallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H5.25a2.25 2.25 0 00-2.25 2.25v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 15.75V10.5m-10.5-9v6.75m0 0l-3-3m3 3l3-3m-4.5 9.75a1.125 1.125 0 01-1.125-1.125V12.75a1.125 1.125 0 112.25 0v1.875c0 .621-.504 1.125-1.125 1.125z" />
    </svg>
);

export const WindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 010 2.25H5.625a1.125 1.125 0 010-2.25z" />
    </svg>
);