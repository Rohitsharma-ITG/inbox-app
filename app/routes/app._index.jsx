import React, { useState, useEffect } from "react";
import { Card, Page, TextField, Button, Select } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";

const Register = () => {
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    customerEmail: "",
    role: "customer", 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const logindata = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          console.error("Error:", res.statusText);
          return;
        }
        const data = await res.json();
        if (data.message === "customer email is found") {
          navigate("/app/chatbox");
        } else {
          setIsLoading(false);
          setFormData((prev) => ({ ...prev, shopEmail: data.shopEmail }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    logindata();
  }, []);

  const handleSubmit = async () => {
    if (!formData.customerEmail) {
      setError("Email is Required");
    } else if (isValidEmail(formData.customerEmail)) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.message === "customer email is found") {
          navigate("/app/chatbox");
        } else {
          setIsLoading(false);
          setError(data.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      setError("Please enter a valid Email");
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  } else {
    return (
      <Page title="Register">
        <Card sectioned>
          <Form method="post">
            <TextField
              label="Enter your email"
              value={formData.customerEmail}
              onChange={(value) => setFormData({ ...formData, customerEmail: value })}
              name="email"
              type="email"
            />
            <Select
              label="Select Role"
              options={[
                { label: "Customer", value: "customer" },
                { label: "Support", value: "support" },
              ]}
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button primary onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Card>
      </Page>
    );
  }
};

export default Register;
