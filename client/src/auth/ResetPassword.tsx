import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const params = useParams();
  const { loading, resetPassword } = useUserStore();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (params.token) {
      await resetPassword(params.token, newPassword);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your new password to reset old one
          </p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="pl-10"
          />
          <LockKeyhole className="absolute inset-y-1.5 left-2 text-gray-600 pointer-events-none focus-visible:ring-1" />
        </div>
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange">
            Set Password
          </Button>
        )}
        <span>
          Back to{" "}
          <Link to={"/login"} className="text-blue-500">
            login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;
