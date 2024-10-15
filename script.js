document.addEventListener('DOMContentLoaded', function () {
    const url = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const auth = 'Basic ' + btoa('coalition:skills-test'); 

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': auth
        }
    })
    .then(response => response.json())
    .then(data => {
        
        const patientList = document.getElementById('patient-list');
        data.forEach(patient => {
            const listItem = document.createElement('li');
            listItem.classList.add('patient');
            if (patient.name === "Jessica Taylor") {
                listItem.classList.add('active');
            }
            listItem.innerHTML = `
                <img src="${patient.profile_picture}" alt="${patient.name}">
                <div class="patient-info">
                    <p>${patient.name}</p>
                    <p>${patient.gender}, ${patient.age}</p>
                </div>
            `;
            patientList.appendChild(listItem);
        });

        const patient = data.find(patient => patient.name === "Jessica Taylor");
        document.getElementById('profile-picture').src = patient.profile_picture;
        document.getElementById('dob').innerText = new Date(patient.date_of_birth).toLocaleDateString();
        document.getElementById('gender').innerText = patient.gender;
        document.getElementById('phone').innerText = patient.phone_number;
        document.getElementById('emergency-contact').innerText = patient.emergency_contact;
        document.getElementById('insurance').innerText = patient.insurance_type;

        const latestDiagnosis = patient.diagnosis_history[0];
        document.getElementById('respiratory-rate').innerText = latestDiagnosis.respiratory_rate.value + ' bpm';
        document.getElementById('temperature').innerText = latestDiagnosis.temperature.value + '°F';
        document.getElementById('heart-rate').innerText = latestDiagnosis.heart_rate.value + ' bpm';

        const diagnosticListBody = document.getElementById('diagnostic-list-body');
        patient.diagnostic_list.forEach(item => {
            const row = `<tr>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.status}</td>
                         </tr>`;
            diagnosticListBody.insertAdjacentHTML('beforeend', row);
        });

        const labResultsList = document.getElementById('lab-results-list');
        patient.lab_results.forEach(result => {
            labResultsList.insertAdjacentHTML('beforeend', `<li>${result}</li>`);
        });

        const ctx = document.getElementById('bpChart').getContext('2d');
        const systolicData = patient.diagnosis_history.map(d => d.blood_pressure.systolic.value);
        const diastolicData = patient.diagnosis_history.map(d => d.blood_pressure.diastolic.value);
        const labels = patient.diagnosis_history.map(d => `${d.month} ${d.year}`);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Systolic',
                        data: systolicData,
                        borderColor: 'red',
                        fill: false
                    },
                    {
                        label: 'Diastolic',
                        data: diastolicData,
                        borderColor: 'blue',
                        fill: false
                    }
                ]
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});
