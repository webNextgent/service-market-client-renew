const ServiceDetails = ({ title, currentStep }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex flex-col items-center justify-center mt-8 md:mt-4 text-center px-4 mb-5">
      <h2 className="text-xl sm:text-2xl md:text-[28px] mb-3.5 text-[#5D4F52]">
        {title}
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 w-full max-w-2xl">
        {steps.map((step) => (
          <div
            key={step}
            className={`h-2 w-[70px] sm:w-[100px] md:w-[120px] rounded-md transition-colors duration-300 ${step <= currentStep ? "bg-[#01788E]" : "bg-[#CBD5E1]"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceDetails;