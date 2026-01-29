// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, UserPlus, Github, Facebook } from 'lucide-react';
// import { FcGoogle } from "react-icons/fc";
// import { Link, useNavigate } from 'react-router-dom';
// import useAuth from '../../../../hooks/useAuth';

// const RegisterForm = () => {
//     const { createUser, googleSignInUser, githubSignInUser, updateUserProfile } = useAuth();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//     });
//     const [showPassword, setShowPassword] = useState({
//         password: false,
//         confirmPassword: false,
//     });
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [socialLoading, setSocialLoading] = useState({
//         google: false,
//         github: false,
//         facebook: false
//     });
//     const [success, setSuccess] = useState(false);

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.name.trim()) {
//             newErrors.name = 'Full name is required';
//         } else if (formData.name.length < 2) {
//             newErrors.name = 'Name must be at least 2 characters';
//         }

//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 8) {
//             newErrors.password = 'Password must be at least 8 characters';
//         } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
//             newErrors.password = 'Password must contain letters and numbers';
//         }

//         if (!formData.confirmPassword) {
//             newErrors.confirmPassword = 'Please confirm your password';
//         } else if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log('Form submission started...');

//         if (!validateForm()) {
//             console.log('Form validation failed');
//             return;
//         }

//         setIsLoading(true);
//         setErrors({});
//         try {
//             console.log('Creating user with email:', formData.email);

//             // 1️⃣ Create user with email & password
//             await createUser(formData.email, formData.password);
//             await updateUserProfile(formData.name); 

//             const authData = {
//                 name: formData?.name || null,
//                 email: formData?.email,
//                 password: formData?.password
//             }

//             const res = await fetch(
//                 "https://service-market-puce.vercel.app/api/v1/auth/register",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(authData),
//                 }
//             );
//             const data = await res.json();
//             console.log("Server response:", data?.Data);

//             // login success হলে
//             localStorage.setItem("accessToken", data?.Data?.token);
//             localStorage.setItem("user", JSON.stringify(data?.Data?.user));

//             setSuccess(true);

//             // 3️⃣ Reset form
//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 confirmPassword: '',
//             });

//             // 4️⃣ Auto-redirect to login after 3 seconds
//             setTimeout(() => {
//                 navigate('/');
//             }, 3000);

//         } catch (error) {
//             console.error('Registration error:', error);
//             console.error('Error code:', error.code);
//             console.error('Error message:', error.message);

//             let errorMessage = 'Registration failed. Please try again.';

//             if (error.code === 'auth/email-already-in-use') {
//                 errorMessage = 'This email is already registered. Please use another email or login.';
//             } else if (error.code === 'auth/invalid-email') {
//                 errorMessage = 'Please enter a valid email address.';
//             } else if (error.code === 'auth/weak-password') {
//                 errorMessage = 'Password is too weak. Please use a stronger password.';
//             } else if (error.code === 'auth/network-request-failed') {
//                 errorMessage = 'Network error. Please check your internet connection.';
//             } else if (error.code === 'auth/operation-not-allowed') {
//                 errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
//             } else if (error.message) {
//                 errorMessage = error.message;
//             }

//             setErrors({
//                 firebase: errorMessage
//             });
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
//             navigate('/');

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

//     const handleGithubSignIn = async () => {
//         setSocialLoading(prev => ({ ...prev, github: true }));

//         try {
//             const result = await githubSignInUser();
//             console.log('GitHub sign-in successful:', result.user);

//             // Success - redirect
//             navigate('/');

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

//         // Clear firebase error when user types
//         if (errors.firebase) {
//             setErrors(prev => ({
//                 ...prev,
//                 firebase: ''
//             }));
//         }
//     };

//     const togglePasswordVisibility = (field) => {
//         setShowPassword(prev => ({
//             ...prev,
//             [field]: !prev[field]
//         }));
//     };

//     const passwordStrength = () => {
//         if (!formData.password) return 0;

//         let strength = 0;
//         if (formData.password.length >= 8) strength++;
//         if (/[A-Z]/.test(formData.password)) strength++;
//         if (/[a-z]/.test(formData.password)) strength++;
//         if (/\d/.test(formData.password)) strength++;
//         if (/[!@#$%^&*]/.test(formData.password)) strength++;

//         return Math.min(strength, 5);
//     };

//     const getStrengthColor = () => {
//         const strength = passwordStrength();
//         if (strength <= 1) return 'bg-red-500';
//         if (strength <= 2) return 'bg-orange-500';
//         if (strength <= 3) return 'bg-yellow-500';
//         if (strength <= 4) return 'bg-blue-500';
//         return 'bg-green-500';
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-md">

//                 {/* Registration Card */}
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
//                                 <UserPlus className="h-8 w-8" />
//                             </div>
//                             <h1 className="text-3xl font-bold mb-2">Create Account</h1>
//                             <p className="text-blue-100/90">Join our platform in just a few steps</p>
//                         </div>
//                     </div>

//                     {/* Success Message */}
//                     {success && (
//                         <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-8 mt-6">
//                             <div className="flex">
//                                 <div className="flex-shrink-0">
//                                     <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-green-700 font-medium">
//                                         ✅ Registration successful!
//                                     </p>
//                                     <p className="text-sm text-green-600 mt-1">
//                                         Redirecting to home page in 3 seconds...
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

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
//                                     <p className="text-sm text-red-700 font-medium">
//                                         Registration Failed
//                                     </p>
//                                     <p className="text-sm text-red-600 mt-1">
//                                         {errors.firebase}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Form */}
//                     <div className="p-8">
//                         {/* Social Login Buttons */}
//                         <div className="space-y-4 mb-8">
//                             <p className="text-center text-sm text-gray-500 font-medium">
//                                 Sign up with
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
//                                 <span className="px-4 bg-white text-gray-500 font-medium">Or register with email</span>
//                             </div>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* Name Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Full Name *
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`}
//                                         placeholder="John Doe"
//                                         disabled={isLoading}
//                                     />
//                                 </div>
//                                 {errors.name && (
//                                     <p className="mt-2 text-sm text-red-600">{errors.name}</p>
//                                 )}
//                             </div>

//                             {/* Email Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email Address *
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
//                                     Password *
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type={showPassword.password ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className={`pl-10 pr-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`}
//                                         placeholder="••••••••"
//                                         disabled={isLoading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => togglePasswordVisibility('password')}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
//                                         disabled={isLoading}
//                                     >
//                                         {showPassword.password ? (
//                                             <EyeOff className="h-5 w-5 text-gray-400" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-400" />
//                                         )}
//                                     </button>
//                                 </div>

//                                 {/* Password Strength Indicator */}
//                                 {formData.password && (
//                                     <div className="mt-2">
//                                         <div className="flex justify-between text-xs text-gray-600 mb-1">
//                                             <span>Password strength:</span>
//                                             <span>
//                                                 {passwordStrength() === 5 ? 'Strong' :
//                                                     passwordStrength() >= 3 ? 'Medium' :
//                                                         'Weak'}
//                                             </span>
//                                         </div>
//                                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                                             <div
//                                                 className={`h-full transition-all duration-300 ${getStrengthColor()}`}
//                                                 style={{ width: `${(passwordStrength() / 5) * 100}%` }}
//                                             />
//                                         </div>
//                                         <ul className="mt-2 text-xs text-gray-600 space-y-1">
//                                             <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
//                                                 <span className="mr-1">•</span> At least 8 characters
//                                             </li>
//                                             <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
//                                                 <span className="mr-1">•</span> Uppercase letter
//                                             </li>
//                                             <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
//                                                 <span className="mr-1">•</span> Number
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 )}

//                                 {errors.password && (
//                                     <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//                                 )}
//                             </div>

//                             {/* Confirm Password Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Confirm Password *
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type={showPassword.confirmPassword ? "text" : "password"}
//                                         name="confirmPassword"
//                                         value={formData.confirmPassword}
//                                         onChange={handleChange}
//                                         className={`pl-10 pr-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400`}
//                                         placeholder="••••••••"
//                                         disabled={isLoading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => togglePasswordVisibility('confirmPassword')}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
//                                         disabled={isLoading}
//                                     >
//                                         {showPassword.confirmPassword ? (
//                                             <EyeOff className="h-5 w-5 text-gray-400" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-400" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.confirmPassword && (
//                                     <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
//                                 )}
//                             </div>

//                             {/* Terms & Conditions */}
//                             <div className="flex items-start">
//                                 <div className="flex items-center h-5">
//                                     <input
//                                         id="terms"
//                                         type="checkbox"
//                                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                         required
//                                         disabled={isLoading}
//                                     />
//                                 </div>
//                                 <div className="ml-3 text-sm">
//                                     <label htmlFor="terms" className="text-gray-700">
//                                         I agree to the{' '}
//                                         <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                             Terms of Service
//                                         </a>{' '}
//                                         and{' '}
//                                         <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                             Privacy Policy
//                                         </a>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* Register Button */}
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
//                                         Creating Account...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <UserPlus className="h-5 w-5 mr-2" />
//                                         Create Account
//                                     </>
//                                 )}
//                             </button>
//                         </form>

//                         {/* Divider */}
//                         <div className="mt-8">
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
//                                 </div>
//                             </div>

//                             {/* Login Link */}
//                             <div className="mt-6 text-center">
//                                 <Link
//                                     to="/login"
//                                     className={`inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                 >
//                                     Sign In Instead
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
//                         <div className="flex items-center justify-center space-x-6">
//                             <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Terms
//                             </a>
//                             <span className="text-gray-300">•</span>
//                             <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Privacy
//                             </a>
//                             <span className="text-gray-300">•</span>
//                             <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
//                                 Contact
//                             </a>
//                         </div>
//                         <p className="mt-3 text-xs text-gray-500 text-center">
//                             © {new Date().getFullYear()} Your Company. All rights reserved.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;