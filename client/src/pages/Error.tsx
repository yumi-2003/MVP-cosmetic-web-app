import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle, House, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-6 rounded-full">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-serif font-bold text-primary">
            {errorStatus === 404 ? "Page Not Found" : "Oops!"}
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
            {errorStatus} - {errorMessage}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm text-left">
          <p className="text-sm text-muted-foreground mb-4">
            We apologize for the inconvenience. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild className="w-full sm:w-auto flex-1 gap-2 text-white dark:text-foreground dark:bg-background hover:bg-foreground/90 dark:hover:bg-background/90" size="lg">
              <Link to="/">
                <House className="w-4 h-4" />
                Return Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto flex-1 gap-2" 
              size="lg"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
