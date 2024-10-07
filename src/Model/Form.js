import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['annual', 'supplementary'], 
        required: true 
    },
    attemptYear: { 
        type: Number, 
        required: true,
        enum: [2018, 2019, 2020, 2021, 2022, 2023, 2024,2025,2026,2027,2028,2029,2030] // Possible attempt years
    },
    regnum: { 
        type: String, 
        required: true, 
        unique: true, // Ensure registration numbers are unique
        minlength: 5,
        maxlength: 5,
    },
    studentName: { 
        type: String, 
        required: true 
    },
    fatherName: { 
        type: String, 
        required: true 
    },
    institute: { 
        type: String, 
        enum: [
            '(FMC) Fazaia Medical College Islamabad', 
            '(FRPMC) Fazaia Ruth Pfau Medical College Karachi'
        ],
        required: true 
    },
    dob: { 
        type: Date, 
        required: true 
    },
    cnic: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d{13}$/.test(v); // Validate CNIC format (13 digits)
            },
            message: props => `${props.value} is not a valid CNIC!`
        }
    },
    mailingAddress: { 
        type: String, 
        required: true 
    },
    studentMobile: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v); // Validate mobile number format
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    gender: { 
        type: String, 
        enum: ['male', 'female'], 
        required: true 
    },
    parentsMobile: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v); // Validate mobile number format
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    attempts: {
        firstProf: { type: Boolean, default: false },
        secondProf: { type: Boolean, default: false },
        thirdProf: { type: Boolean, default: false },
        fourthProf: { type: Boolean, default: false },
        finalProf: { type: Boolean, default: false },
    },
    subjects: {
        firstProf: [{ type: String }],
        secondProf: [{ type: String }],
        thirdProf: [{ type: String }],
        fourthProf: [{ type: String }],
        finalProf: [{ type: String }]
    }
});

// Create the model
const FormModel = mongoose.model('Form', formSchema);

export default FormModel;
