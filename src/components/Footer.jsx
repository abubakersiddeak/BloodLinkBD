export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-4">BloodDonate</h3>
            <p className="text-gray-600">
              Connecting blood donors with recipients, making blood donation
              easier and more accessible.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-red-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-red-500">
                  Contact
                </a>
              </li>
              <li>
                <a href="/donate" className="text-gray-600 hover:text-red-500">
                  Donate Blood
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-600 hover:text-red-500">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-red-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-red-500">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>📞 Emergency: +880 179088476</li>
              <li>📧 Email: abubakersiddeak@gmail.com</li>
              <li>📍 Location: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>© 2024 BloodLiink BD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
