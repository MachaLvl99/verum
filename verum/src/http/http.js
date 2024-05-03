import Axios from 'axios';

const processData = (data) => {
    const text = data.response;
    console.log(text);
};

export const getResponse = async () => {
    const response = await Axios.get('http://localhost:8080/gemini');
    processData(response.data);
};

export const postResponse = async (msg) => {
    const response = await Axios.post('http://localhost:8080/gemini', msg, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const text = JSON.stringify(response.data.response);
    return text;
};


