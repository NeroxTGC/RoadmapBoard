import React from "react";
import { Link } from "wasp/client/router";
import { SignupForm } from "wasp/client/auth";

export default function Signup() {
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full h-full max-w-sm p-5 bg-white dark:bg-gray-900">
          <div>
            <SignupForm />
            <div className="mt-4 text-center">
              If you already have an account go to{" "}
              <Link to="/login" className="text-primary-500 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-600 underline">
                login
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}