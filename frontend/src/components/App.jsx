import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, LogOut, RotateCcw } from 'lucide-react';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Async function to handle logins 
  const handleLogin = async () => {

    setShowLogin(false);
    setLoading(true);
    
    try {
        const response = await fetch("http://localhost:3000/signin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: loginData })
        });

        const result = await response.json();

        // Check if login was successful
        if (result.success || response.ok) {
          // Set user as logged in
          setIsLoggedIn(true);
          setCurrentUser({
            email: loginData.email,
            id: result.message.LocalId
          });

          console.log(result.message.LocalId);

          // Grab the data from firebase 
          const response_two = await fetch(`http://localhost:3000/getcounter?userId=${result.message.LocalId}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });

          const result_two = await response_two.json()

          if(result_two.success || response_two.ok) 
          {
            console.log(result_two.message);
            setCounter(result_two.message.clicks);
            setLoginData({ email: '', password: '' });
            console.log("Login successful!");
          } 
        } 
        else {
          setLoginData({ email: '', password: '' });
          throw new Error(result.message || 'Login failed');
        }
    }
    catch (error) {
        console.log("Error:", error);
        alert("Login failed: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  // Async function to handle sign ups 
  const handleSignup = async () => {

    setShowSignup(false);
    setLoading(true);
    
    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: signupData })
        });

        const result = await response.json();

        // Check if signup was successful
        if (result.success || response.ok) {
          // Set user as logged in immediately after signup
          setIsLoggedIn(true);
          setCurrentUser({
            email: signupData.email,
            id: result.message.LocalId
          });
          
          // New users start with counter at 0
          setCounter(0);
          
          // Clear signup form
          setSignupData({ email: '', password: '', confirmPassword: '' });
          
          console.log("Signup successful!");
        } else {
          throw new Error(result.message || 'Signup failed');
        }
    }
    catch (error) {
        console.log("Error:", error);
        alert("Signup failed: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  // Handle counter increment
  const incrementCounter = async () => {

    const newCount = counter + 1;
    setCounter(newCount);
    
    try {
      // Optional: Send counter update to backend
      await fetch("http://localhost:3000/incounter", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          counter: newCount
        })
      });
    } catch (error) {
      console.log("Error updating counter:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      console.log("Logged out successfully");
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Logged in user dashboard
  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 m-0 p-0" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        {/* Header with logout */}
        <div className="w-full p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Welcome Back!
              </span>
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-white/90 text-sm sm:text-base">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-red-500 text-white font-semibold 
                         rounded-full hover:bg-red-600 transition-all duration-300 
                         transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Counter Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 lg:mb-8">
              Your Click Counter
            </h2>
            
            {/* Counter Display */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl">
              <div className="text-6xl sm:text-8xl lg:text-9xl font-bold text-white mb-6">
                {counter}
              </div>
              <p className="text-white/80 text-lg sm:text-xl mb-8">
                Total clicks: {counter}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={incrementCounter}
                  className="px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold 
                           rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 
                           transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                >
                  🎯 Click Me!
                </button>
        
              </div>
            </div>
            
            <p className="text-white/70 text-sm sm:text-base">
              Your progress is automatically saved! 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default auth page (not logged in)
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 m-0 p-0" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Header Section */}
      <div className="w-full p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              SimpleWebApp
            </span>
          </h1>

          {/* Auth Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white font-semibold border-2 border-white/30 rounded-full 
                       hover:bg-white/20 hover:border-white/50 transition-all duration-300 
                       transform hover:scale-105 backdrop-blur-sm"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold 
                       rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 
                       transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12 overflow-y-auto">
        <div className="text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 lg:mb-8">
            Welcome to the Click Viewer!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
            Sign-up/Login to see your clicks!
          </p>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-purple-500 focus:border-transparent transition-all duration-200 
                               bg-gray-50 focus:bg-white text-base"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-purple-500 focus:border-transparent transition-all duration-200 
                               bg-gray-50 focus:bg-white text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg 
                           font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
                           transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-base disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              {/* Switch to Signup */}
              <div className="mt-6 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  onClick={switchToSignup}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Join Us
                </h2>
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Signup Form */}
              <div className="space-y-5">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-pink-500 focus:border-transparent transition-all duration-200 
                               bg-gray-50 focus:bg-white text-base"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-pink-500 focus:border-transparent transition-all duration-200 
                               bg-gray-50 focus:bg-white text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-pink-500 focus:border-transparent transition-all duration-200 
                               bg-gray-50 focus:bg-white text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-lg 
                           font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 
                           transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-base disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              {/* Switch to Login */}
              <div className="mt-6 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={switchToLogin}
                  className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;