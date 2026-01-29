/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const LoginModal = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpSuccessModal, setOtpSuccessModal] = useState(false);
    const [phone, setPhone] = useState("");
    const [fullPhoneNumber, setFullPhoneNumber] = useState("");
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [validationError, setValidationError] = useState("");
    const inputRefs = useRef([]);
    const { setUser } = useAuth();
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState({
        name: 'United Arab Emirates',
        code: '+971',
        iso: 'ae'
    });

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setPhone("");
            setPhoneNumber("");
            setFullPhoneNumber("");
            setOtp(['', '', '', '']);
            setOtpSuccessModal(false);
            setValidationError("");
            setSelectedCountry(null);
            setSearch("");
            setOpenModal(false);
            setCountry({
                name: 'United Arab Emirates',
                code: '+971',
                iso: 'ae'
            });
        }
    }, [open]);

    // Countdown logic
    useEffect(() => {
        if (timer > 0 && otpSuccessModal) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, otpSuccessModal]);

    useEffect(() => {
        const otpString = otp.join('');

        if (otpString.length === 4 && otp.every(d => d !== '')) {
            handleVerifyOtp();
        }
    }, [otp]);


    // Handle OTP input change
    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];

            if (newOtp[index]) {
                // Clear current input if it has value
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1].focus();
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Validate phone number
    const validatePhoneNumber = () => {
        if (!phoneNumber.trim()) {
            setValidationError("Please enter phone number");
            return false;
        }

        const digitsOnly = phoneNumber.replace(/\D/g, '');

        if (country?.iso === 'ae' && digitsOnly.length !== 9) {
            setValidationError("UAE phone numbers must be 9 digits");
            return false;
        }

        if (country?.iso === 'us' && digitsOnly.length !== 10) {
            setValidationError("US phone numbers must be 10 digits");
            return false;
        }

        if (digitsOnly.length < 6) {
            setValidationError("Phone number is too short");
            return false;
        }

        return true;
    };

    const handleContinue = async () => {
        if (!validatePhoneNumber()) {
            return;
        }

        setLoading(true);
        const fullPhone = country.code + phoneNumber;
        setFullPhoneNumber(fullPhone);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: fullPhone,
                    countryCode: country?.iso || 'ae',
                    countryName: country?.name || 'United Arab Emirates'
                })
            });

            const data = await response.json();

            if (data?.success === false) {
                toast.error(data?.message || 'Failed to send OTP. Please try again.');
            } else {
                setOtpSuccessModal(true);
                setTimer(30);
                setResendDisabled(true);
                toast.success("OTP sent successfully!");

                // Auto focus first OTP input
                setTimeout(() => {
                    if (inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            return;
        }

        setVerifyingOtp(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: fullPhoneNumber,
                    otp: otpString
                })
            });

            const data = await response.json();

            if (data?.success === true) {
                const token = data?.Data?.token;
                if (token) {
                    localStorage.setItem('access-token', token);
                    toast.success("Verification successful! Welcome!");
                    onClose();
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                }
            } else {
                localStorage.removeItem("access-token");
                setUser(null);
                setOtp(['', '', '', '']);
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
                toast.error(data?.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Verification failed. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendDisabled) return;

        setResendDisabled(true);
        setTimer(30);
        setOtp(['', '', '', '']);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: fullPhoneNumber,
                    via: 'sms'
                })
            });

            const data = await response.json();

            if (data?.success === false) {
                toast.error(data?.message || 'Failed to resend OTP');
                setResendDisabled(false);
            } else {
                toast.success("OTP resent successfully!");
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error('Failed to resend OTP');
            setResendDisabled(false);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        const digits = pastedData.replace(/\D/g, '').split('');

        const newOtp = ['', '', '', ''];
        digits.forEach((digit, index) => {
            if (index < 4) newOtp[index] = digit;
        });

        setOtp(newOtp);

        const lastIndex = Math.min(digits.length - 1, 3);
        inputRefs.current[lastIndex]?.focus();
    };


    const handleCountrySelect = (selectedCountry) => {
        setCountry(selectedCountry);
        setOpenModal(false);
        setSearch("");
    };

    const countries = [
        // Recommended / Top Countries
        { name: 'Bangladesh', code: '+880', iso: 'bd' },
        { name: 'United Arab Emirates', code: '+971', iso: 'ae' },
        { name: 'India', code: '+91', iso: 'in' },
        { name: 'Pakistan', code: '+92', iso: 'pk' },

        // Others (A-Z Sorted)
        { name: 'Afghanistan', code: '+93', iso: 'af' },
        { name: 'Albania', code: '+355', iso: 'al' },
        { name: 'Algeria', code: '+213', iso: 'dz' },
        { name: 'Andorra', code: '+376', iso: 'ad' },
        { name: 'Angola', code: '+244', iso: 'ao' },
        { name: 'Antigua and Barbuda', code: '+1', iso: 'ag' },
        { name: 'Argentina', code: '+54', iso: 'ar' },
        { name: 'Armenia', code: '+374', iso: 'am' },
        { name: 'Australia', code: '+61', iso: 'au' },
        { name: 'Austria', code: '+43', iso: 'at' },
        { name: 'Azerbaijan', code: '+994', iso: 'az' },
        { name: 'Bahamas', code: '+1', iso: 'bs' },
        { name: 'Bahrain', code: '+973', iso: 'bh' },
        { name: 'Barbados', code: '+1', iso: 'bb' },
        { name: 'Belarus', code: '+375', iso: 'by' },
        { name: 'Belgium', code: '+32', iso: 'be' },
        { name: 'Belize', code: '+501', iso: 'bz' },
        { name: 'Benin', code: '+229', iso: 'bj' },
        { name: 'Bhutan', code: '+975', iso: 'bt' },
        { name: 'Bolivia', code: '+591', iso: 'bo' },
        { name: 'Bosnia and Herzegovina', code: '+387', iso: 'ba' },
        { name: 'Botswana', code: '+267', iso: 'bw' },
        { name: 'Brazil', code: '+55', iso: 'br' },
        { name: 'Brunei', code: '+673', iso: 'bn' },
        { name: 'Bulgaria', code: '+359', iso: 'bg' },
        { name: 'Burkina Faso', code: '+226', iso: 'bf' },
        { name: 'Burundi', code: '+257', iso: 'bi' },
        { name: 'Cambodia', code: '+855', iso: 'kh' },
        { name: 'Cameroon', code: '+237', iso: 'cm' },
        { name: 'Canada', code: '+1', iso: 'ca' },
        { name: 'Cape Verde', code: '+238', iso: 'cv' },
        { name: 'Central African Republic', code: '+236', iso: 'cf' },
        { name: 'Chad', code: '+235', iso: 'td' },
        { name: 'Chile', code: '+56', iso: 'cl' },
        { name: 'China', code: '+86', iso: 'cn' },
        { name: 'Colombia', code: '+57', iso: 'co' },
        { name: 'Comoros', code: '+269', iso: 'km' },
        { name: 'Congo', code: '+242', iso: 'cg' },
        { name: 'Costa Rica', code: '+506', iso: 'cr' },
        { name: 'Croatia', code: '+385', iso: 'hr' },
        { name: 'Cuba', code: '+53', iso: 'cu' },
        { name: 'Cyprus', code: '+357', iso: 'cy' },
        { name: 'Czech Republic', code: '+420', iso: 'cz' },
        { name: 'Denmark', code: '+45', iso: 'dk' },
        { name: 'Djibouti', code: '+253', iso: 'dj' },
        { name: 'Dominica', code: '+1', iso: 'dm' },
        { name: 'Dominican Republic', code: '+1', iso: 'do' },
        { name: 'Ecuador', code: '+593', iso: 'ec' },
        { name: 'Egypt', code: '+20', iso: 'eg' },
        { name: 'El Salvador', code: '+503', iso: 'sv' },
        { name: 'Estonia', code: '+372', iso: 'ee' },
        { name: 'Ethiopia', code: '+251', iso: 'et' },
        { name: 'Fiji', code: '+679', iso: 'fj' },
        { name: 'Finland', code: '+358', iso: 'fi' },
        { name: 'France', code: '+33', iso: 'fr' },
        { name: 'Gabon', code: '+241', iso: 'ga' },
        { name: 'Gambia', code: '+220', iso: 'gm' },
        { name: 'Georgia', code: '+995', iso: 'ge' },
        { name: 'Germany', code: '+49', iso: 'de' },
        { name: 'Ghana', code: '+233', iso: 'gh' },
        { name: 'Greece', code: '+30', iso: 'gr' },
        { name: 'Grenada', code: '+1', iso: 'gd' },
        { name: 'Guatemala', code: '+502', iso: 'gt' },
        { name: 'Guinea', code: '+224', iso: 'gn' },
        { name: 'Guyana', code: '+592', iso: 'gy' },
        { name: 'Haiti', code: '+509', iso: 'ht' },
        { name: 'Honduras', code: '+504', iso: 'hn' },
        { name: 'Hong Kong', code: '+852', iso: 'hk' },
        { name: 'Hungary', code: '+36', iso: 'hu' },
        { name: 'Iceland', code: '+354', iso: 'is' },
        { name: 'Indonesia', code: '+62', iso: 'id' },
        { name: 'Iran', code: '+98', iso: 'ir' },
        { name: 'Iraq', code: '+964', iso: 'iq' },
        { name: 'Ireland', code: '+353', iso: 'ie' },
        { name: 'Israel', code: '+972', iso: 'il' },
        { name: 'Italy', code: '+39', iso: 'it' },
        { name: 'Jamaica', code: '+1', iso: 'jm' },
        { name: 'Japan', code: '+81', iso: 'jp' },
        { name: 'Jordan', code: '+962', iso: 'jo' },
        { name: 'Kazakhstan', code: '+7', iso: 'kz' },
        { name: 'Kenya', code: '+254', iso: 'ke' },
        { name: 'Kuwait', code: '+965', iso: 'kw' },
        { name: 'Kyrgyzstan', code: '+996', iso: 'kg' },
        { name: 'Laos', code: '+856', iso: 'la' },
        { name: 'Latvia', code: '+371', iso: 'lv' },
        { name: 'Lebanon', code: '+961', iso: 'lb' },
        { name: 'Libya', code: '+218', iso: 'ly' },
        { name: 'Lithuania', code: '+370', iso: 'lt' },
        { name: 'Luxembourg', code: '+352', iso: 'lu' },
        { name: 'Madagascar', code: '+261', iso: 'mg' },
        { name: 'Malaysia', code: '+60', iso: 'my' },
        { name: 'Maldives', code: '+960', iso: 'mv' },
        { name: 'Mali', code: '+223', iso: 'ml' },
        { name: 'Malta', code: '+356', iso: 'mt' },
        { name: 'Mauritius', code: '+230', iso: 'mu' },
        { name: 'Mexico', code: '+52', iso: 'mx' },
        { name: 'Moldova', code: '+373', iso: 'md' },
        { name: 'Monaco', code: '+377', iso: 'mc' },
        { name: 'Mongolia', code: '+976', iso: 'mn' },
        { name: 'Montenegro', code: '+382', iso: 'me' },
        { name: 'Morocco', code: '+212', iso: 'ma' },
        { name: 'Myanmar', code: '+95', iso: 'mm' },
        { name: 'Namibia', code: '+264', iso: 'na' },
        { name: 'Nepal', code: '+977', iso: 'np' },
        { name: 'Netherlands', code: '+31', iso: 'nl' },
        { name: 'New Zealand', code: '+64', iso: 'nz' },
        { name: 'Nigeria', code: '+234', iso: 'ng' },
        { name: 'Norway', code: '+47', iso: 'no' },
        { name: 'Oman', code: '+968', iso: 'om' },
        { name: 'Panama', code: '+507', iso: 'pa' },
        { name: 'Paraguay', code: '+595', iso: 'py' },
        { name: 'Peru', code: '+51', iso: 'pe' },
        { name: 'Philippines', code: '+63', iso: 'ph' },
        { name: 'Poland', code: '+48', iso: 'pl' },
        { name: 'Portugal', code: '+351', iso: 'pt' },
        { name: 'Qatar', code: '+974', iso: 'qa' },
        { name: 'Romania', code: '+40', iso: 'ro' },
        { name: 'Russia', code: '+7', iso: 'ru' },
        { name: 'Saudi Arabia', code: '+966', iso: 'sa' },
        { name: 'Senegal', code: '+221', iso: 'sn' },
        { name: 'Serbia', code: '+381', iso: 'rs' },
        { name: 'Singapore', code: '+65', iso: 'sg' },
        { name: 'South Africa', code: '+27', iso: 'za' },
        { name: 'South Korea', code: '+82', iso: 'kr' },
        { name: 'Spain', code: '+34', iso: 'es' },
        { name: 'Sri Lanka', code: '+94', iso: 'lk' },
        { name: 'Sudan', code: '+249', iso: 'sd' },
        { name: 'Sweden', code: '+46', iso: 'se' },
        { name: 'Switzerland', code: '+41', iso: 'ch' },
        { name: 'Syria', code: '+963', iso: 'sy' },
        { name: 'Taiwan', code: '+886', iso: 'tw' },
        { name: 'Tanzania', code: '+255', iso: 'tz' },
        { name: 'Thailand', code: '+66', iso: 'th' },
        { name: 'Tunisia', code: '+216', iso: 'tn' },
        { name: 'Turkey', code: '+90', iso: 'tr' },
        { name: 'Uganda', code: '+256', iso: 'ug' },
        { name: 'Ukraine', code: '+380', iso: 'ua' },
        { name: 'United Kingdom', code: '+44', iso: 'gb' },
        { name: 'United States', code: '+1', iso: 'us' },
        { name: 'Uruguay', code: '+598', iso: 'uy' },
        { name: 'Uzbekistan', code: '+998', iso: 'uz' },
        { name: 'Venezuela', code: '+58', iso: 've' },
        { name: 'Vietnam', code: '+84', iso: 'vn' },
        { name: 'Yemen', code: '+967', iso: 'ye' },
        { name: 'Zambia', code: '+260', iso: 'zm' },
        { name: 'Zimbabwe', code: '+263', iso: 'zw' }
    ];

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!open) return null;
    return (
        <div
            className=" fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
            flex items-end md:items-center
            justify-center
            p-0 md:p-4"
            onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="  relative w-full max-w-[500px] bg-white shadow-2xl font-sans text-[#2d2d2d]
                rounded-t-[28px] md:rounded-[28px]
                p-6 md:p-8
                animate-slideUp md:animate-none">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {!otpSuccessModal ? (
                    <>
                        {/* Header */}
                        <h2 className="text-[20px] md:text-[28px] font-bold mb-6 text-[#1a1a1a]">Log in or sign up</h2>

                        <p className="text-[17px] text-[#333333] mb-8">
                            Please enter your mobile number to proceed.
                        </p>

                        {/* Input Group */}
                        <div className="mb-8">
                            <label className="block text-[17px] font-semibold mb-3 text-[#1a1a1a]">
                                Mobile Number
                            </label>

                            <div className={`flex items-center border ${validationError ? 'border-red-500' : 'border-[#008b9b]'} rounded-xl h-16 px-4 focus-within:ring-1 ${validationError ? 'focus-within:ring-red-500' : 'focus-within:ring-[#008b9b]'} transition-all`}>
                                {/* Flag and Country Code */}
                                <div
                                    onClick={() => setOpenModal(true)}
                                    className="flex items-center gap-2 pr-3 border-r border-gray-200 mr-4 cursor-pointer hover:bg-gray-50 px-2 -ml-2 rounded transition-colors"
                                >
                                    <div className="w-8 h-5 overflow-hidden rounded-sm shadow-sm">
                                        <img
                                            src={`https://flagcdn.com/w40/${country.iso}.png`}
                                            alt={country.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-[19px] text-[#1a1a1a] font-medium">{country.code}</span>
                                </div>

                                {/* Input Field */}
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setPhoneNumber(value);
                                        setValidationError("");
                                    }}
                                    placeholder="Phone Number"
                                    className="flex-1 text-[19px] outline-none placeholder:text-[#9ca3af] bg-transparent"
                                    inputMode="numeric"
                                />

                                {/* Mobile Icon */}
                                <div className="text-gray-500 ml-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                        <path d="M12 18h.01"></path>
                                    </svg>
                                </div>
                            </div>
                            {validationError && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {validationError}
                                </p>
                            )}
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={loading || !phoneNumber}
                            className={`w-full ${loading || !phoneNumber ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f16522] hover:bg-[#d9561a]'} text-white text-[20px] font-bold py-[18px] rounded-xl transition-colors`}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    SENDING...
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </button>
                        <p className="text-center my-2 text-blue-500">use only whatsapp number</p>
                    </>
                ) : (
                    // OTP Verification View
                    <>
                        <h2 className="text-[18px] md:text-[28px] font-bold mb-6 text-[#1a1a1a]">Verify mobile number</h2>

                        <p className="text-[17px] text-[#333333] mb-8">
                            We've sent an OTP via SMS to <span className="font-bold">{fullPhoneNumber}</span>.
                            Please enter the 4-digit code below.
                        </p>

                        {/* OTP Input Group */}
                        <div className="mb-8">
                            <div className="flex gap-4 justify-center mb-6" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-full h-auto text-[30px] md:text-[40px] font-semibold text-center border-2 border-gray-300 rounded-lg focus:border-[#f16522] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all duration-200 bg-gray-50"
                                        disabled={verifyingOtp}
                                    />
                                ))}
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center">
                                {resendDisabled ? (
                                    <p className="text-[17px] text-[#333333]">
                                        Resend OTP in <span className="font-bold text-[#1a1a1a]">00:{timer.toString().padStart(2, '0')}</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-[#f16522] font-medium hover:text-[#d9561a] transition-colors text-[17px] inline-flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Resend OTP via SMS
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Auto verification indicator */}
                        {otp.every(digit => digit !== '') && (
                            <div className="mb-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verifying OTP...
                                </div>
                            </div>
                        )}

                        {/* Edit Phone Number */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setOtpSuccessModal(false)}
                                className="text-gray-600 hover:text-gray-800 font-medium transition-colors text-[16px] inline-flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Use different phone number
                            </button>
                        </div>
                    </>
                )}

                {openModal && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute w-full max-w-[360px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden font-sans"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 9999
                        }}
                    >
                        {/* Search Header */}
                        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100 z-10">
                            <input
                                type="text"
                                placeholder="Search"
                                className="text-[19px] text-[#2d2d2d] outline-none w-full bg-transparent placeholder:text-gray-400 font-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-gray-600 hover:text-black transition-colors ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Country List Scroll Area */}
                        <div className="h-[420px] overflow-y-auto custom-scrollbar">
                            {filteredCountries.map((countryItem, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCountrySelect(countryItem)}
                                    className={`group flex items-center px-5 py-[12px] cursor-pointer hover:bg-[#f3f4f6] transition-all ${countryItem.iso === country.iso ? 'bg-[#f5f5f5]' : ''}`}
                                >
                                    {/* Flag Image from CDN */}
                                    <div className="w-7 h-5 mr-5 shadow-sm overflow-hidden rounded-[2px] border border-gray-100 flex-shrink-0">
                                        <img
                                            src={`https://flagcdn.com/w40/${countryItem.iso}.png`}
                                            alt={countryItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-[18px] text-[#1a1a1a] font-normal truncate">
                                            {countryItem.name}
                                        </span>
                                        <span className="text-[18px] text-gray-400 font-light">
                                            {countryItem.code}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tailwind Custom Scrollbar Styling */}
                        <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 14px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: #d1d5db;
                                border-radius: 20px;
                                border: 4px solid white;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: #9ca3af;
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;