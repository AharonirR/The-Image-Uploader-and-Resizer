const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
    region: 'YOUR_AWS_REGION'
});
const s3 = new AWS.S3();

async function uploadAndResize() {
    const fileInput = document.getElementById('fileInput');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const resizedImage = document.getElementById('resizedImage');

    if (fileInput.files.length === 0) {
        alert('Please select an image file.');
        return;
    }

    const file = fileInput.files[0];
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(async function(blob) {
                const params = {
                    Bucket: 'YOUR_S3_BUCKET_NAME',
                    Key: file.name,
                    Body: blob,
                    ContentType: file.type,
                    ACL: 'public-read'
                };

                try {
                    const data = await s3.upload(params).promise();
                    resizedImage.src = data.Location;
                    alert('Image uploaded and resized successfully!');
                } catch (error) {
                    console.error('Error uploading to S3:', error);
                    alert('Error uploading image.');
                }
            }, file.type);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
