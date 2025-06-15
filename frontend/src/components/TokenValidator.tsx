import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const TokenValidator: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setSession } = useSession();

  useEffect(() => {
    const validateToken = async () => {
      if (!token || token.length !== 22) {
        console.log("Invalid token length");
        navigate('/invalid-token');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/validate-token/${token}`);
        const data = await response.json();
        console.log(data);

        if (data.valid) {
          setSession(data.umbrellaId);
          navigate('/');
        } else {
          navigate('/invalid-token');
        }
      } catch (error) {
        console.error('Error validating token:', error);
        navigate('/invalid-token');
      }
    };

    validateToken();
  }, [token, navigate, setSession]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Validating your QR code...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default TokenValidator; 