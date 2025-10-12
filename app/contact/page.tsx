// components/ContactUs.tsx
import Breadcrumb from "@/components/breadcumb";

const ContactUs = () => {
  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />

      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 bg-white my-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm bg-gray-100 border border-gray-200 rounded px-4 py-2 mb-6">
          <span className="text-blue-600 font-medium">🏠</span>
          <span>/</span>
          <span className="text-gray-600">Contact Us</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>

        {/* Our Location */}
        <h2 className="text-xl font-semibold mb-3">Our Location</h2>
        <div className="border border-gray-300 rounded-md p-5 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p>
                <span className="font-semibold">Owner</span>
                <br />
                Md. Saiful Islam
              </p>
              <p className="mt-4">
                <span className="font-semibold">
                  Easy Tech Communication OPC
                </span>
                <br />
                KF#315/2, West Joydebpur, Gazipur city corporation, Gazipur.
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Telephone</span>
                <br />
                <a
                  href="tel:+8801911458398"
                  className="text-blue-600 hover:underline"
                >
                  +8801911458398
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-2">
          Contact Form
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-500">*</span> Your Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-500">*</span> E-Mail Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-500">*</span> Enquiry
            </label>
            <textarea
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100 resize-none"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
