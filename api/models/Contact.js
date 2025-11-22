const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'HamzaIG Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },
    consent: {
      type: Boolean,
      required: [true, 'Consent is required'],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on email for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

module.exports = Contact;

