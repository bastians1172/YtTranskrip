export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">

<div className="flex-grow max-w-3xl mx-auto w-full">
<h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p>If you have any questions, feel free to reach out.</p>
        <form className="mt-6">
          <label className="block mb-2">Name</label>
          <input type="text" className="w-full p-2 border rounded mb-4" placeholder="Your Name" />
          
          <label className="block mb-2">Email</label>
          <input type="email" className="w-full p-2 border rounded mb-4" placeholder="Your Email" />
          
          <label className="block mb-2">Message</label>
          <textarea className="w-full p-2 border rounded mb-4" rows={4} placeholder="Your Message"></textarea>
          
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
        </div>
    );
  }
  