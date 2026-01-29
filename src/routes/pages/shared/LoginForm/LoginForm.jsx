// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, LogIn, Github, Facebook } from 'lucide-react';
// import { FcGoogle } from "react-icons/fc";
// import { Link } from 'react-router-dom';
// import useAuth from '../../../../hooks/useAuth';

// const LoginForm = () => {
//     const {  googleSignInUser, githubSignInUser } = useAuth();

//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [socialLoading, setSocialLoading] = useState({
//         google: false,
//         github: false,
//         facebook: false
//     });

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };


//     const handleGithubSignIn = async () => {
//         setSocialLoading(prev => ({ ...prev, github: true }));

//         try {
//             const result = await githubSignInUser();
//             console.log('GitHub sign-in successful:', result.user);

//             // GitHub user info
//             const user = result.user;
//             console.log('GitHub User Details:', {
//                 displayName: user.displayName,
//                 email: user.email,
//                 photoURL: user.photoURL,
//                 uid: user.uid,
//                 providerId: user.providerId
//             });

//             // Success - redirect
//             // navigate('/dashboard');

//         } catch (error) {
//             console.error('GitHub sign-in error:', error);

//             let errorMessage = 'GitHub sign-in failed. Please try again.';

//             if (error.code === 'auth/account-exists-with-different-credential') {
//                 errorMessage = 'An account already exists with the same email address but different sign-in credentials. Try signing in with Google.';
//             } else if (error.code === 'auth/popup-closed-by-user') {
//                 errorMessage = 'Sign-in popup was closed. Please try again.';
//             } else if (error.code === 'auth/network-request-failed') {
//                 errorMessage = 'Network error. Please check your internet connection.';
//             } else if (error.code === 'auth/operation-not-allowed') {
//                 errorMessage = 'GitHub sign-in is not enabled. Please contact support.';
//             } else if (error.code === 'auth/popup-blocked') {
//                 errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
//             }

//             setErrors({ firebase: errorMessage });
//         } finally {
//             setSocialLoading(prev => ({ ...prev, github: false }));
//         }
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setIsLoading(true);
//         const authData = {
//             email: formData?.email,
//             password: formData?.password
//         }

//         try {
//             // const result = await signInUser(formData.email, formData.password);
//             const res = await fetch(
//                 "https://service-market-puce.vercel.app/api/v1/auth/login",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(authData),
//                 }
//             );
//             const data = await res.json();
//             console.log("login response:", data?.Data);
//             // console.log('Login successful:', result.user);
//     // login success হলে
//             localStorage.setItem("accessToken", data?.Data[1]);
//             localStorage.setItem("user", JSON.stringify(data?.Data[0]));
//             // Success - you can redirect here
//             // navigate('/dashboard');

//         } catch (error) {
//             console.error('Login error:', error);

//             let errorMessage = 'Login failed. Please try again.';

//             if (error.code === 'auth/invalid-credential') {
//                 errorMessage = 'Invalid email or password. Please try again.';
//             } else if (error.code === 'auth/user-not-found') {
//                 errorMessage = 'No account found with this email.';
//             } else if (error.code === 'auth/wrong-password') {
//                 errorMessage = 'Incorrect password. Please try again.';
//             } else if (error.code === 'auth/too-many-requests') {
//                 errorMessage = 'Too many failed attempts. Please try again later.';
//             }

//             setErrors({ firebase: errorMessage });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         setSocialLoading(prev => ({ ...prev, google: true }));

//         try {
//             const result = await googleSignInUser();
//             console.log('Google sign-in successful:', result.user);

//             // Success - you can redirect here
//             // navigate('/dashboard');

//         } catch (error) {
//             console.error('Google sign-in error:', error);

//             let errorMessage = 'Google sign-in failed. Please try again.';

//             if (error.code === 'auth/popup-closed-by-user') {
//                 errorMessage = 'Sign-in popup was closed. Please try again.';
//             } else if (error.code === 'auth/network-request-failed') {
//                 errorMessage = 'Network error. Please check your internet connection.';
//             }

//             setErrors({ firebase: errorMessage });
//         } finally {
//             setSocialLoading(prev => ({ ...prev, google: false }));
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }

//         // Clear firebase error
//         if (errors.firebase) {
//             setErrors(prev => ({
//                 ...prev,
//                 firebase: ''
//             }));
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-md">
//                 {/* Back to Home Link */}
//                 {/* <div className="mb-4">
//                     <Link
//                         to="/"
//                         className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
//                     >
//                         ← Back to Home
//                     </Link>
//                 </div> */}

//                 {/* Login Card */}
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white text-center relative overflow-hidden">
//                         {/* Background Pattern */}
//                         <div className="absolute inset-0 opacity-10">
//                             <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
//                             <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
//                         </div>

//                         <div className="relative">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
//                                 <LogIn className="h-8 w-8" />
//                             </div>
//                             <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
//                             <p className="text-blue-100/90">Sign in to your account to continue</p>
//                         </div>
//                     </div>

//                     {/* Firebase Error Message */}
//                     {errors.firebase && (
//                         <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-8 mt-6">
//                             <div className="flex">
//                                 <div className="flex-shrink-0">
//                                     <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-red-700">{errors.firebase}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Form */}
//                     <div className="p-8">
//                         {/* Social Login Buttons */}
//                         <div className="space-y-4 mb-8">
//                             <p className="text-center text-sm text-gray-500 font-medium">
//                                 Sign in with
//                             </p>

//                             <div className="flex items-center justify-center gap-5">
//                                 {/* Google Button */}
//                                 <button
//                                     type="button"
//                                     onClick={handleGoogleSignIn}
//                                     disabled={socialLoading.google || isLoading}
//                                     className={`flex items-center justify-center px-7 py-3 border rounded-lg transition-all duration-200 ${socialLoading.google || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5'} border-gray-300 hover:border-gray-400`}
//                                 >
//                                     {socialLoading.google ? (
//                                         <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                     ) : (
//                                         <FcGoogle className="h-5 w-5" />
//                                     )}
//                                 </button>

//                                 {/* GitHub Button */}
//                                 <button
//                                     type="button"
//                                     onClick={handleGithubSignIn}
//                                     disabled={socialLoading.github || isLoading}
//                                     className={`flex items-center justify-center px-7 py-3 border rounded-lg transition-all duration-200 ${socialLoading.github || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5'} border-gray-300 hover:border-gray-400 bg-gray-900 hover:bg-gray-800 text-white`}
//                                 >
//                                     {socialLoading.github ? (
//                                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                     ) : (
//                                         <Github className="h-5 w-5" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Divider */}
//                         <div className="relative my-8">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
//                             </div>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* Email Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email Address
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`}
//                                         placeholder="you@example.com"
//                                         disabled={isLoading}
//                                     />
//                                 </div>
//                                 {errors.email && (
//                                     <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//                                 )}
//                             </div>

//                             {/* Password Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className={`pl-10 pr-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`}
//                                         placeholder="••••••••"
//                                         disabled={isLoading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
//                                         disabled={isLoading}
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5 text-gray-400" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-400" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.password && (
//                                     <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//                                 )}
//                             </div>

//                             {/* Remember Me & Forgot Password */}
//                             {/* <div className="flex items-center justify-between">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="remember-me"
//                                         type="checkbox"
//                                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                         disabled={isLoading}
//                                     />
//                                     <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
//                                         Remember me
//                                     </label>
//                                 </div>
//                                 <Link
//                                     className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                                 >
//                                     Forgot password?
//                                 </Link>
//                             </div> */}

//                             {/* Login Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Signing in...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <LogIn className="h-5 w-5 mr-2" />
//                                         Sign In
//                                     </>
//                                 )}
//                             </button>
//                         </form>

//                         {/* Register Link */}
//                         <div className="mt-8 text-center">
//                             <p className="text-sm text-gray-600">
//                                 Don't have an account?{' '}
//                                 <Link
//                                     to="/register"
//                                     className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                                 >
//                                     Create new account
//                                 </Link>
//                             </p>
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
//                         <div className="flex items-center justify-center space-x-6">
//                             <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Terms
//                             </Link>
//                             <span className="text-gray-300">•</span>
//                             <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Privacy
//                             </Link>
//                             <span className="text-gray-300">•</span>
//                             <Link className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Contact
//                             </Link>
//                         </div>
//                         <p className="mt-3 text-xs text-gray-500 text-center">
//                             © {new Date().getFullYear()} Your Company. All rights reserved.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Demo Note */}
//                 {/* <div className="mt-8 text-center">
//                     <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg">
//                         <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                         </svg>
//                         <p className="text-sm text-blue-700">
//                             Demo: Use <span className="font-mono bg-blue-100 px-1 py-0.5 rounded">test@example.com</span> / <span className="font-mono bg-blue-100 px-1 py-0.5 rounded">password123</span>
//                         </p>
//                     </div>
//                 </div> */}
//             </div>
//         </div>
//     );
// };

// export default LoginForm;