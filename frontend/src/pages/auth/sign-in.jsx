import { useNavigate } from "react-router-dom";
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import Swal from "sweetalert2";


export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        localStorage.setItem("accessToken", result.data.access_token);
        Swal.fire({ icon: "success", title: "Berhasil Login!" });
        navigate("/dashboard/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Login!",
          text: result.message || "Terjadi kesalahan.",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Tidak bisa terhubung ke server.",
      });
    }
  };

  return (
    <section className="flex h-screen w-screen">
      {/* FORM LOGIN */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form onSubmit={handleLogin} className="mt-8 mb-2 w-full max-w-sm">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Checkbox
            label={
              <Typography variant="small" color="gray" className="flex items-center justify-start font-medium">
                I agree the&nbsp;
                <a href="#" className="font-normal text-black transition-colors hover:text-gray-900 underline">
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </div>

      {/* GAMBAR + TEKS OVERLAY */}
      <div className="hidden lg:flex w-2/5 h-full relative">
        <img
          src="/img/pattern.png"
          alt="Login Illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6">
          <Typography variant="h3" className="text-white font-bold">
            Sistem Manajemen Kendaraan
          </Typography>
          <Typography variant="paragraph" className="text-white mt-2 max-w-sm">
            Kelola armada dan pengemudi Anda dengan lebih mudah dan efisien.
          </Typography>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
