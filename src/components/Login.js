import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { RiLoginBoxLine, RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import apiService from "./apiService"; // Adjust the import path to your actual file
import styles from "./styles/SignIn.module.css";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  let navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  async function postSignInInfo(inputData) {
    try {
      const response = await apiService.signInUser({
        username: inputData.username,
        password: inputData.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data);
     
        console.log(localStorage.getItem("token")+"login");
        showSuccessMessage("login successfull")
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
       
      } else {
        // This block may not be reached if the backend returns an error status code
        showWarningToast(response.data.message || "Login failed");
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        if (error.response.status === 500) {
          showWarningToast("Login Service Down");
        } else if (error.response.status === 401) {
          showWarningToast("Invalid credentials. Please try again.");
        } else {
          showWarningToast(error.response.data.message || "Login failed");
        }
      } else {
        showWarningToast("An unexpected error occurred");
      }
    }
  }
  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function showWarningToast(inputMessage) {
    toast.warn(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }

  return (
    <Container fluid className={styles.container}>
      <ToastContainer />
      <Formik
        validationSchema={schema}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          postSignInInfo(values).finally(() => setSubmitting(false));
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className={styles.formContainer}>
            <Row className="mb-5 text-center">
              <h1 className="text-success">Sign In</h1>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="signInUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={touched.username && errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="signInPassword">
                <Form.Label>Password</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && errors.password}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit" variant="success">
              Sign In <RiLoginBoxLine />
            </Button>
            <br />
            <Link to="/forgotPassword" className="btn btn-primary">
              Forgot Password
            </Link>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default SignIn;
