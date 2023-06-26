import Layout from "../components/Layout";
import mastheadImg from "../assets/masthead.jpg";
import altSvg from "../assets/altitude.svg";

import FormField from "../components/FormField";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Loader from "../components/Loader";

const initState = {
  email: "",
  username: "",
  password: "",
  confpass: "",
  firstname: "",
  lastname: "",
};

const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;

function Auth() {

  const [action, setAction] = useState("signup");
  const [formData, setFormData] = useState(initState);
  const [formErrors, setFormErrors] = useState(initState);
  const [isValid, setIsValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();

  // if there's no error remaining AND all the fields are not empty we enable the button
  useEffect(() => {
    const noRemainingErrors = Object.values(formErrors).every(
      (error) => error === ""
    );

    // for signup flow
    if (action === "signup") {
      let noEmptyFields = Object.values(formData).every(
        (value) => value.trim() !== ""
      );

      if (noRemainingErrors && noEmptyFields) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      // for login flow
      formData.email.trim() !== "" &&
      formData.password.trim() &&
      noRemainingErrors
        ? setIsValid(true)
        : setIsValid(false);
    }
  }, [formErrors, formData, action]);

  // reset errors and empty fields on flow switch
  useEffect(() => {
    setFormData(initState);
    setFormErrors(initState);
  }, [action]);

  // realtime validation onKeyPress(onChange)
  const handleInputChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value.trim();
    let errorMessage = "";

    if (action === "signup") {
      switch (fieldName) {
        case "email":
          if (!emailRegex.test(fieldValue)) {
            errorMessage = "Please enter a valid email!";
          }
          break;
        case "password":
          if (fieldValue.length < 6) {
            errorMessage = "Password should be at least 6 characters!";
          }
          break;
        case "confpass":
          if (fieldValue !== formData.password) {
            errorMessage = "Passwords do not match!";
          }
          break;
        case "username":
          if (fieldValue.length < 4) {
            errorMessage = "Username must be longer than 3 letters";
          }
          break;
        default:
          break;
      }
    } else {
      switch (fieldName) {
        case "email":
          if (!emailRegex.test(fieldValue)) {
            errorMessage = "Please enter a valid email!";
          }
          break;
        case "password":
          if (fieldValue.length < 6 || fieldValue === "") {
            errorMessage = "Need a password (min 6 chars)";
          }
          break;
      }
    }

    setFormErrors((errors) => ({
      ...errors,
      [fieldName]: errorMessage,
    }));

    setFormData((form) => ({
      ...form,
      [fieldName]: fieldValue,
    }));
  };

  // send to server
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const parsedData = new FormData(form);

    /* for (const entry of formData.entries()) {
      console.log(entry);
    } */

    if (action === "signup") {
      // signup requests
      try {
        parsedData.delete("confpass"); // not sending this extra field
        const response = await fetch(`/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(parsedData)),
        });

        const data = await response.json();

        if (response.ok) {
          // console.log("Data sent successfully ✅");
          toast(data.message);
          setAction("login");
        } else {
          // probably wont need it with so much client validation but stays there
          toast(data.message, "error");
        }
      } catch (error) {
        console.error(`❌ error occured: ${error.message}`);
      }
    } else {
      // login requests
      if (submitting) {
        return;
      }
      setSubmitting(true);
      await login(formData.email, formData.password, setSubmitting);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center bg-white">
        {/* masthead image */}
        <div className="w-1/2 relative hidden lg:block">
          <div className="absolute top-2 left-8">
            <img src={altSvg} alt="Altitude Air Icon" />
          </div>
          <img
            className="aspect-square object-contain pb-5 pl-5"
            src={mastheadImg}
            alt="Gray Airplane Wing"
          />
          <div className="absolute bottom-0 left-0">
            <div className="opacity-80 bg-slate-900 p-12 w-3/4 h-80 flex flex-col items-center">
              <h1 className="font-sans text-6xl text-white font-semibold">
                Altitude Air
              </h1>
              <hr className="border-t-4 border-white my-4 w-20" />
              <p className="text-white text-sm text-center">
                We promise to ensure that your well-being is taken care of while
                travelling with us. Boasting top in class fleet inventory and a
                5 star approval for our in-flight experience, you know
                you&#39;re getting the best from Altitude with no attitude.
              </p>
            </div>
          </div>
        </div>
        {/* form container */}
        <div className="lg:w-1/2 lg:px-12 p-6 md:py-16 lg:py-0 relative">
          <div className="flex items-end w-full">
            <button
              onClick={() =>
                setAction(action === "signup" ? "login" : "signup")
              }
              className={`absolute right-3 top-5 md:top-1 md:right-10 bg-transparent border-indigo-600 border-2 rounded-md font-semibold text-indigo-600 px-3 py-2 md:px-6 md:py-1 transition duration-300 ease-in-out hover:bg-indigo-600 hover:text-white hover:-translate-y-1 uppercase lg:text-base text-xs`}
            >
              {action === "signup" ? "sign in" : "sign up"}
            </button>
          </div>
          <form method="post" onSubmit={handleSubmit}>
            <h2 className="font-sans text-xl md:text-4xl font-bold mb-3 text-indigo-700">
              {action === "signup"
                ? "Explore & Experience"
                : "Login to Altitude Air"}
            </h2>
            <h4 className="font-sans text-sm font-semibold text-indigo-600 mb-10">
              {action === "signup"
                ? "Get onto your most comfortable journey yet. All the way up."
                : "Start off where you left from."}
            </h4>
            {action === "signup" && (
              <div className="flex gap-5">
                <FormField
                  name="firstname"
                  type="text"
                  placeholder="First Name"
                  width="w-1/2"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange(e, "firstname")}
                />
                <FormField
                  name="lastname"
                  type="text"
                  placeholder="Last Name"
                  width="w-1/2"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange(e, "lastname")}
                />
              </div>
            )}
            <FormField
              name="email"
              type="email"
              placeholder="Email"
              width="w-full"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              error={formErrors.email}
            />
            {action === "signup" && (
              <FormField
                name="username"
                type="text"
                placeholder="Username"
                width="w-full"
                value={formData.username}
                onChange={(e) => handleInputChange(e, "username")}
                error={formErrors.username}
              />
            )}
            <FormField
              name="password"
              type="password"
              placeholder="Password"
              width="w-full"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              error={formErrors.password}
            />
            {action === "signup" && (
              <FormField
                name="confpass"
                type="password"
                placeholder="Confirm Password"
                width="w-full"
                value={formData.confpass}
                onChange={(e) => handleInputChange(e, "confpass")}
                error={formErrors.confpass}
              />
            )}
            <div className="w-full text-center">
              <button
                disabled={!isValid || submitting}
                type="submit"
                className={`w-full mt-2 bg-indigo-700 py-3 text-white font-semibold enabled:transition enabled:duration-300 ease-in-out hover:bg-indigo-800 enabled:hover:-translate-y-1 cursor-pointer enabled:hover:shadow-indigo-200 enabled:hover:shadow-xl uppercase disabled:bg-gray-700 disabled:cursor-not-allowed ${
                  submitting &&
                  action !== "signup" &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                {action === "signup" ? (
                  submitting ? (
                    <Loader size="sm" />
                  ) : (
                    "get started"
                  )
                ) : submitting ? (
                  <Loader size="sm" />
                ) : (
                  "login to your account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Auth;
