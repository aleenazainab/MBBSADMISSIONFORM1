
import React, { useState, useRef } from 'react';
import './form.scss';
import axios from 'axios';
import Compressor from 'compressorjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Form = () => {

    const [imageError, setImageError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const formRef = useRef();
    const declarationRef = useRef();
    const downloadButtonRef = useRef(null);
    // const [showScrollMessage, setShowScrollMessage] = useState(false);
   const navigate = useNavigate();

    const location = useLocation();
    const { regnum, cnic } = location.state || {}; // Get regnum and cnic from state if available

    const [formData, setFormData] = useState({
        regnum: regnum || '',
        studentName: '',
        fatherName: '',
        institute: '',
        dob: '',
        cnic: cnic || '',
        mailingAddress: '',
        studentMobile: '',
        parentsMobile: '',
        attemptYear: '',
        gender: '',
        attempts: {
            firstProf: false,
            secondProf: false,
            thirdProf: false,
            fourthProf: false,
            finalProf: false,
        },
        subjects: {
            firstProf: [],
            secondProf: [],
            thirdProf: [],
            fourthProf: [],
            finalProf: []
        }
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
    //const [isAgreed, setIsAgreed] = useState(false);

    const subjects = {
        firstProf: ["Block I", "Block II", "Block III"],
        secondProf: ["Block IV", "Block V", "Block VI", "Islamic & Pak Studies"],
        thirdProf: ["Block VII", "Block VIII", "Block IX"],
        fourthProf: ["Community Medicine", "Special Pathology", "Ophthalmology (EYE)", "Otorhinolaryngology (ENT)"],
        finalProf: ["Medicine & Allied", "Surgery & Allied ", "Obstetrics & Gynaecology", "Paediatrics"]
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {

            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setSelectedImage(reader.result);
                        setImageError('');
                        setFormData({
                            ...formData,
                            image: reader.result,
                            imageType: file.type
                        });
                    };
                    reader.readAsDataURL(result);
                },
                error(err) {
                    console.error('Image compression error:', err);
                }
            });
        } else {
            setImageError('Please select a valid image file.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'studentMobile' || name === 'parentsMobile') {
            const phonePattern = /^[0-9]{11}$/;
            if (!phonePattern.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Phone number must be exactly 11 digits.'
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: ''
                }));
            }
        }

        if (name === 'dob') {
            const date = new Date(value);
            const formattedDob = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        
            setFormData({
                ...formData,
                [name]: value,
                formattedDob
            });
            return;
        }
        
        setFormData({ ...formData, [name]: value });
    };
//---------------------------------
       /* if (name === 'dob') {
            setFormData({
                ...formData,
                [name]: value,
                formattedDob: new Date(value).toLocaleDateString('en-GB')
            });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };*/

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (name in formData.attempts) {
            setFormData(prevFormData => {

                const updatedAttempts = {
                    firstProf: false,
                    secondProf: false,
                    thirdProf: false,
                    fourthProf: false,
                    finalProf: false,
                    [name]: checked,
                };

                const updatedSubjects = {
                    firstProf: [],
                    secondProf: [],
                    thirdProf: [],
                    fourthProf: [],
                    finalProf: [],
                };
                return {
                    ...prevFormData,
                    attempts: updatedAttempts,
                    subjects: updatedSubjects,
                };
            });
        }
    };

    const handleSubjectChange = (event, prof) => {
        const { value, checked } = event.target;

        setFormData(prevFormData => {
            const subjects = [...prevFormData.subjects[prof]];

            if (checked) {
                subjects.push(value);
            } else {
                const index = subjects.indexOf(value);
                if (index > -1) {
                    subjects.splice(index, 1);
                }
            }

            // Check if at least one subject is selected
            const isAnySubjectSelected = Object.values({
                ...prevFormData.subjects,
                [prof]: subjects,
            }).some(subjects => subjects.length > 0);

            if (!isAnySubjectSelected) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    subjects: 'At least one subject must be selected',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    subjects: '',
                }));
            }

            return {
                ...prevFormData,
                subjects: {
                    ...prevFormData.subjects,
                    [prof]: subjects,
                },
            };
        });
    };

    const handleRegnumChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setFormData((prev) => ({ ...prev, regnum: value }));
        }
    };

    const handleCnicChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,13}$/.test(value)) {
            setFormData((prev) => ({ ...prev, cnic: value }));
        }
    };

    const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to shrink if needed
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    };


    const validateForm = () => {
        const newErrors = {};
        if (!selectedImage) newErrors.image = 'Image is required';
        if (!formData.regnum.trim()) newErrors.regnum = 'MBBS Registration Num is required';
        if (!formData.studentName.trim()) newErrors.studentName = 'Student Full Name is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Father Name is required';
        if (!formData.institute.trim()) newErrors.institute = 'Name of Institute is required';
        if (!formData.dob) newErrors.dob = 'Date of Birth is required';
        if (!formData.cnic) newErrors.cnic = 'Student CNIC is required';
        if (!formData.mailingAddress.trim()) newErrors.mailingAddress = 'Mailing Address is required';
        if (!formData.studentMobile.trim()) newErrors.studentMobile = 'Student Mobile Number is required';
        if (!formData.parentsMobile.trim()) newErrors.parentsMobile = 'Parent\'s Mobile Number is required';
        if (!formData.gender) newErrors.gender = 'Please select gender';
        if (!formData.session || !formData.attemptYear) newErrors.session = 'Please select both Annual/Supplementary and Year.';
        if (!formData.repeater) newErrors.repeater = 'Please indicate if you are repeating the exam.';

        if (Object.values(formData.subjects).every(subjects => subjects.length === 0)) {
            newErrors.subjects = 'At least one subject must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm


        const hideElements = () => {
            const elementsToHide = document.querySelectorAll('.pdf-exclude');
            elementsToHide.forEach(element => element.style.display = 'none');
        };


        const restoreElements = () => {
            const elementsToHide = document.querySelectorAll('.pdf-exclude');
            elementsToHide.forEach(element => element.style.display = '');
        };


        hideElements();

        try {

            if (formRef.current) {
                const canvas1 = await html2canvas(formRef.current);
                const imgData1 = canvas1.toDataURL('image/png');
                const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
              

                pdf.addImage(imgData1, 'PNG', 0, 0, imgWidth, imgHeight1);
            } else {
                console.error('formRef is null or undefined');
                return;
            }


            pdf.addPage();


            if (declarationRef.current) {
                const canvas2 = await html2canvas(declarationRef.current);
                const imgData2 = canvas2.toDataURL('image/png');
                const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;
               

                pdf.addImage(imgData2, 'PNG', 0, 0, imgWidth, imgHeight2);
            } else {
                console.error('declarationRef is null or undefined');
                return;
            }

            pdf.save('Form.pdf');
        } catch (error) {
            console.error('Error generating PDF', error);
        } finally {

            restoreElements();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Confirmation popup
    const confirmSubmit = window.confirm("Are you sure you want to save the form?");
    if (!confirmSubmit) {
        return; // Exit if the user cancels
    }
        const selectedType = formData.session === 'annual' ? 'annual' : 'supplementary';
        const updatedFormData = { ...formData, type: selectedType };
        const isValid = validateForm();
    
        if (!isValid) {
            return;
        }
    
        try {
            const response = await axios.post('http://52.0.142.51:5001/submitform', updatedFormData);
            if (response.status === 201) {
                setSuccessMessage('Form submitted successfully');
                setErrors({});
                setIsSubmitted(true);
                setTimeout(() => {
                    if (downloadButtonRef.current) {
                        downloadButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'An error occurred while submitting the form' });
        }
    };
    


    const handleSaveAndDownload = async () => {
         alert("Wait, your form is still downloading.");
        try {
            await generatePDF(); // Wait for the PDF generation to complete
            navigate('/endpage'); // Redirect to end page after generating PDF
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Handle the error accordingly, maybe show a message to the user
        }
    };


    return (
        <section className='form-container' >
            <form className='form-body' onSubmit={handleSubmit} ref={formRef}>

                <div className='mymaindiv'>
                    <div className='form-header'>
                        <img src='/assets/air-university.png' className='university-logo' alt="University Logo" />
                    </div>

                    <div className='admission-info'>
                        <h1>MBBS ADMISSION FORM</h1>
                        <h2>PROFESSIONAL MBBS EXAMINATIONS</h2>

                        <div className='session-checkboxes'>
                            <div className='seconddiv'>
                            <label className='labelyy'>
                                <input
                                    type="checkbox"
                                    name="session"
                                    value="annual"
                                    checked={formData.session === 'annual'}
                                    onChange={(e) => setFormData({ ...formData, session: e.target.checked ? 'annual' : '' })}
                                />
                                Annual
                            </label>
                            <label className='labelyy'>
                                <input
                                    type="checkbox"
                                    name="session"
                                    value="supplementary"
                                    checked={formData.session === 'supplementary'}
                                    onChange={(e) => setFormData({ ...formData, session: e.target.checked ? 'supplementary' : '' })}
                                    readOnly={isSubmitted}
                                />
                                Supplementary
                            </label>
                            </div>
                         


                            <div className='attemptYear-group'>
                                <label>Year:</label>
                                <select
                                    name='attemptYear'
                                    value={formData.attemptYear}
                                    onChange={handleInputChange}
                                    disabled={isSubmitted}

                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 7 }, (_, i) => 2018 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.session && <span className='error-message'>{errors.session}</span>}

                        </div>
                    </div>

                    <div className='upload-section'>
                        <label htmlFor="fileUpload" className="upload-label">
                            <img src={selectedImage || '/assets/upload.png'} alt="Upload" className="upload-image" />
                            <input
                                type="file"
                                id="fileUpload"
                                accept="image/*"

                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                readOnly={isSubmitted}

                            />
                        </label>
                        {imageError && <span className='error-message'>{imageError}</span>}
                        {errors.image && <span className='error-message'>{errors.image}</span>}
                    </div>
                </div>



                <div className='inputclaassss'>
                    <div className="form-group">

                        <label>MBBS Registration Number</label>
                        <input
                            type="text"
                            id="regnum"
                            name="regnum"
                            placeholder="XXXXX"
                            value={formData.regnum}
                            onChange={handleRegnumChange}
                            maxLength="5"
                            readOnly={!!regnum}

                        />
                        {errors.regnum && <span className='error-message'>{errors.regnum}</span>}
                    </div>


                    <div className='form-group'>
                        <label>Student Full Name (First, Middle, Last):</label>
                        <input
                            type="text"
                            id="studentName"
                            name="studentName"
                            placeholder='Enter Student Name'
                            value={formData.studentName}
                            onChange={handleInputChange}
                            readOnly={isSubmitted}
                        />
                        {errors.studentName && <span className='error-message'>{errors.studentName}</span>}
                    </div>
                </div>
                <div className='inputclaassss'>

                <div className='form-group'>
                    <label>Father Name (First, Middle, Last):</label>
                    <input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        placeholder='Enter Father Name'
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                    />
                    {errors.fatherName && <span className='error-message'>{errors.fatherName}</span>}
                </div>



                
                <div className='form-group'>
    <label>Student's Date of Birth(yyyy/mm/dd):</label>
    <input
        type="date"
        id="dob"
        name="dob"
        value={formData.dob}
        onChange={(e) => {
            const value = e.target.value;
            const date = new Date(value);
            const formattedDob = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            setFormData({
                ...formData,
                dob: value,                // Store the original value
                formattedDob: formattedDob // Automatically formatted as dd/mm/yyyy
            });
        }}
        disabled={isSubmitted}
    />
    
    {errors.dob && <span className='error-message'>{errors.dob}</span>}
</div>



                </div>
                <div className='inputclaassss'>
                <div className='form-group'>
                    <label>Student Mobile Number:</label>
                    <input
                        type="tel"
                        id="studentMobile"
                        name="studentMobile"
                        placeholder='Enter 11-digit Mobile Number'
                        value={formData.studentMobile}
                        onChange={handleInputChange}
                        maxLength={11}
                        disabled={isSubmitted}
                    />
                    {errors.studentMobile && <span className='error-message'>{errors.studentMobile}</span>}
                </div>

                <div className="form-group">
                    <label>Student CNIC:</label>
                    <input
                        type="text"
                        id="cnic"
                        name="cnic"
                        placeholder="XXXXXXXXXXXXX"
                        value={formData.cnic}
                        onChange={handleCnicChange}
                        maxLength="13"
                        readOnly={!!cnic}

                    />
                    {errors.cnic && <span className='error-message'>{errors.cnic}</span>}
                </div>
                </div>


                <div className='inputclaassss'>
                <div className='form-group full-width'>
                    <label>Name of Institute:</label>
                    <select
                        id="institute"
                        name="institute"
                        value={formData.institute}
                        onChange={handleInputChange}
                        disabled={isSubmitted}
                    >
                        <option value="">Select Institute</option>
                        <option value="(FMC) Fazaia Medical College Islamabad">(FMC) Fazaia Medical College Islamabad</option>
                        <option value="(FRPMC) Fazaia Ruth Pfau Medical College Karachi">(FRPMC) Fazaia Ruth Pfau Medical College Karachi</option>
                    </select>
                    {errors.institute && <span className='error-message'>{errors.institute}</span>}
                </div>
                <div className='form-group'>
                    <label>Parent's Mobile Number:</label>
                    <input
                        type="tel"
                        id="parentsMobile"
                        name="parentsMobile"
                        placeholder='Enter 11-digit Mobile Number'
                        value={formData.parentsMobile}
                        onChange={handleInputChange}
                        maxLength={11}
                        disabled={isSubmitted}
                    />
                    {errors.parentsMobile && <span className='error-message'>{errors.parentsMobile}</span>}
                </div>
                </div>
               
                <div className='form-group full-width'>
                    <label>Mailing Address :</label>
                    <textarea
                        id="mailingAddress"
                        name="mailingAddress"
                        placeholder='Enter Mailing Address (mention all relevant information like post code etc)'
                        value={formData.mailingAddress}
                        onChange={(e) => {
                            handleInputChange(e);
                            autoResize(e); // Call autoResize to adjust height
                        }}
                        disabled={isSubmitted}
                    />

                    {errors.mailingAddress && <span className='error-message'>{errors.mailingAddress}</span>}
                </div>
               
                <div className="">
                    <label className="gender-label">Gender:</label>
                    <div className="gender-options">
                        <div>
                            <input
                                type="radio"
                                id="male"
                                className='mali'
                                name='gender'
                                value="male"
                                onChange={handleInputChange}
                                disabled={isSubmitted}
                            />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                className='mali'
                                value="female"
                                onChange={handleInputChange}
                                disabled={isSubmitted}
                            />
                            <label htmlFor="female">Female</label>
                        </div>

                    </div>
                    {errors.gender && <span className='error-message'>{errors.gender}</span>}
                </div>

                <div className=''>
                    <label className='gender-label  newname'>PROFS:</label>
                    <div className="attempt-section">
                        {Object.keys(subjects).map(prof => (
                            <div key={prof} className='attempt-section'>
                                <label>
                                    <input
                                        type="checkbox"
                                        id={prof}
                                        name={prof}
                                        className='mali'
                                        checked={formData.attempts[prof]}
                                        onChange={handleCheckboxChange}
                                        disabled={isSubmitted}
                                    />
                                    {prof.charAt(0).toUpperCase() + prof.slice(1).replace(/([A-Z])/g, ' $1').trim()}


                                </label>
                                {formData.attempts[prof] && (
                                    <div className='subjects-section'>
                                        {subjects[prof].map(subject => (
                                            <label key={subject}>
                                                <input
                                                    type="checkbox"
                                                    value={subject}
                                                    checked={formData.subjects[prof].includes(subject)}
                                                    onChange={(e) => handleSubjectChange(e, prof)}
                                                    disabled={isSubmitted}
                                                />
                                                {subject}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.subjects && <span className='error-message'>{errors.subjects}</span>}
                </div>

                <div className="">
                    <label className='gender-label'>Are you repeating this selected Prof exam?</label>
                    <div className="newlastdiv">
                        <label className='yesbutton'>
                            <input
                                type="radio"
                                name="yesno"
                                className='mali'
                                value="yes"
                                onChange={(e) => setFormData({ ...formData, repeater: e.target.value })}
                                disabled={isSubmitted}
                            /> Yes
                        </label>
                        <label className='yesbutton'>
                            <input
                                type="radio"
                                name="yesno"
                                value="no"
                                 className='mali'
                                onChange={(e) => setFormData({ ...formData, repeater: e.target.value })}
                                disabled={isSubmitted}
                            /> No
                        </label>
                    </div>
                    {errors.repeater && <span className='error-message'>{errors.repeater}</span>}
                </div>
                <div className='submit-button-group pdf-exclude'>
                    <button 
                    type="submit"
                    className='submit-button' 
                    disabled={isSubmitted}  
                    >Save & Submit
                    </button>

                    {successMessage && <div className='success-message'>{successMessage}</div>}


                </div>


                {successMessage && isSubmitted && (
                    <div className="declaration-section" ref={declarationRef}>

                        <h1>STUDENT'S DECLARATION</h1>
                        <p>
                            I <span className="student-name">{formData.studentName}</span> Registration Number MBBS- <span className="registration-number">{formData.regnum}</span> hereby solemnly declare that:
                        </p>
                        <ol className="declaration-points">
                            <li>I have paid all the dues of FMC / FRPMC / AU and nothing is outstanding against me.</li>
                            <li>The information provided and statements made by me in this form are true and correct to the best of my knowledge and belief and nothing has been concealed or withheld herein.</li>
                            <li>I shall be responsible if my application form is rejected for any error, misinformation or incomplete entries made by me.</li>
                            <li>I understand that applying for examination without being eligible for it is a crime punishable under law and in such a case University has every right to cancel my result.</li>
                        </ol>



                        <p className="note"> Note: Date and Signature must be done after printing the form</p>

                        <div className="signature-section">
                            <div className="date-line">
                                <label htmlFor="declaration-date">Date:</label>
                                <span className="line"></span>
                            </div>
                            <div className="signature-line">
                                <label htmlFor="signature">Signature of the applicant:</label>
                                <span className="line"></span>
                            </div>
                        </div>

                        <hr className="section-separator" />

                        <h1>HEAD OF INSTITUTION CERTIFICATION</h1>
                        <h3>(For College use only)</h3>
                        <p>I certify that the candidate is eligible in all respects as per Rules & Regulations of PMDC & Air University Islamabad to take the above mentioned examination.</p>
                       
                        <div className="date-section">
                            <div className="date-line">
                                <label htmlFor="declaration-date">Date:</label>
                                <span className="line"></span>
                            </div>
                            <div className="signature-line">
                                <label htmlFor="signature">Signature of the Head of Institute (with Name & Stamp):</label>
                                <span className="line"></span>
                            </div>
                        </div>

                        <hr className="section-separator" />

                        <h1>AIR UNIVERSITY EXAMINATIONS</h1>
                        <h3>(For Exam office only)</h3>
                        <div className="info-field">
                            <label htmlFor="student-name">Student Name:</label>
                            <span className="studentline">{formData.studentName}</span>
                        </div>

                        <div className="info-field">
                            <label htmlFor="regnum">Registration Number:</label>
                            <span className="line">{formData.regnum}</span>
                        </div>

                        <div className="info-field">
                            <label htmlFor="exam-roll">Exam Roll No:</label>
                            <span className="line"></span>
                        </div>
                        <div className="info-field">
                            <label htmlFor="exam-type">Exam Type:</label>
                            <span className="line"></span>
                        </div>

                       
                        <div className="signature-section">
                            <div className="date-input">
                                <label htmlFor="declaration-date">Date:</label>
                                <span className="line"></span>
                            </div>
                            <div className="signature-input">
                                <label htmlFor="signature">Signature of Director Examinations Air University:</label>
                                <span className="line"></span>
                            </div>
                        </div>


                        <div className='button-container pdf-exclude'>
                            <button
                                type="button"
                                className='save-button '
                                onClick={handleSaveAndDownload}
                                ref={downloadButtonRef}
                            >
                                Download Form
                            </button>
                        </div>

                    </div>
                )}
            </form>
        </section>
    );

};
export default Form;
