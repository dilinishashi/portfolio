import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import emailjs from "emailjs-com";
import { showSuccess, showError } from "@/utils/toast";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.subject || !form.message) {
      showError("Please fill out all required fields.");
      return;
    }
    setIsSending(true);
    try {
      await emailjs.send(
        "service_ub01352",
        "template_l1opnka",
        {
          from_name: `${form.firstName} ${form.lastName}`,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        "WBUCFoJxw0XnBMkh6"
      );
      showSuccess("Your message has been sent successfully!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      showError("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      value: "hasan.bose1@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+94 767844940",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Keppitigala Road, Elhenpitiya, Panagamuwa.",
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Let's Work Together
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
            Have a project in mind? I'd love to hear about it. Let's create something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Left Column: Form */}
          <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-2xl">Send Me a Message</CardTitle>
                <p className="text-muted-foreground">Fill out the form below and I'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={form.firstName} onChange={handleInputChange} placeholder="Inamul" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={form.lastName} onChange={handleInputChange} placeholder="Hasan" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleInputChange} placeholder="inamulhasan@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" value={form.subject} onChange={handleInputChange} placeholder="Project Inquiry" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" value={form.message} onChange={handleInputChange} placeholder="Tell me about your project..." required rows={5} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg" disabled={isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Get in Touch */}
          <div className="md:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Get in Touch</h3>
              <p className="text-muted-foreground">
                I'm always open to discussing new opportunities, creative projects, or potential collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>
            <div className="space-y-4">
              {contactDetails.map((detail) => (
                <Card key={detail.title} className="bg-muted/50 p-4 flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                    <detail.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{detail.title}</h4>
                    <p className="text-muted-foreground text-sm">{detail.value}</p>
                  </div>
                </Card>
              ))}
              <Card className="bg-muted/50 p-4">
                <h4 className="font-semibold">Quick Response</h4>
                <p className="text-muted-foreground text-sm">
                  I typically respond to emails within 24 hours. For urgent inquiries, feel free to reach out via phone or LinkedIn.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;