import { Button } from "@/components/shared/mui";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-minsk-50 to-minsk-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-minsk-800 mb-4">
          Welcome to Multaqa
        </h1>
        <p className="text-minsk-600 font-pt-sans text-lg">
          Your Gateway to University Events at GUC
        </p>
        {/* MUI Button from ZIP directory -S */}
        <Button variant="contained" color="primary" className="mt-6">
          Get Started
        </Button>
      </div>
    </div>
  );
}