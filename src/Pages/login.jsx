import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Button from "../Components/Button";
import '../Styles/login.css';

const Login = () => {

  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Connect MetaMask');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const connectWallet = async () => {
    setErrorMessage(null);

    if (typeof window.ethereum === 'undefined') {
      setErrorMessage('MetaMask is not installed. Please install it to connect.');
      return;
    }

    try {
      setIsConnecting(true);
      setStatusMessage('Connecting...');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        setStatusMessage('Connected');
        navigate('/farmhome');
        }
       else {
        setErrorMessage('No accounts found. Please unlock your MetaMask wallet.');
        setStatusMessage('Connect MetaMask');
      }

    } catch (error) {
      if (error.code === 4001) {
        setErrorMessage('Connection request rejected by user.');
      } else {
        setErrorMessage(`An error occurred: ${error.message}`);
      }
      setStatusMessage('Connect MetaMask');

    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container">
        <div className="header">
            <Header title={'Login VIA Metamask'}/>
        </div>
      <div className="content">
          <Button
            title={statusMessage}
            onClick={connectWallet}
            disabled={isConnecting}
            className={`
              w-full sm:w-auto px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 transform
              ${isConnecting ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95'}
              focus:outline-none focus:ring-4 focus:ring-blue-300
            `}
          />
          {walletAddress && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg w-full text-center">
              <p className="text-sm text-green-800 font-medium break-all">
                Connected: <br />
                <span className="font-bold">{walletAddress}</span>
              </p>
            </div>
          )}
      </div>
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <Button
              title={'Close'}
              onClick={() => setErrorMessage(null)}
              className="px-6 py-2 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;