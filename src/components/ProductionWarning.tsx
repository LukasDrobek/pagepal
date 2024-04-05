import { ShieldAlert } from "lucide-react";

const ProductionWarning = () => {
  return (
    <div className="flex items-center gap-3 text-base border-2 border-red-400 mb-3 p-3 rounded-md">
      <ShieldAlert className="h-6 w-6 text-red-500" />
      <p className="text-base text-red-500">
        Some features are still under development and this route may not be
        fully functional at this time.
      </p>
    </div>
  );
};

export default ProductionWarning;
