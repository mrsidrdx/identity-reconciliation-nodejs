# Identity Reconciliation NodeJS Project

## My Resume
https://siddharthasatyakama.com/resume/my-resume-v1.pdf

## Installation

1. Copy the `.env.example` file located in the root directory of the project and create a new file named `.env`. Update the values in the `.env` file according to your environment.

2. Build the Docker container by running the following command in the root directory of the project:

   ```shell
   docker-compose up --build
   ```

## Usage

To interact with the API, you can use any HTTP client, such as cURL or Postman. The main api endpoint is http://localhost:3000/identify. This is a POST request and it takes
request body like this:

```json
{
    "email": "apple@gmail.com",
    "phoneNumber": "444444"
}
```

It's response looks like this:

```json
{
    "contact": {
        "primaryContactId": 21,
        "emails": [
            "apple@gmail.com",
            "ball@gmail.com",
            "yellow@gmail.com"
        ],
        "phoneNumbers": [
            "111111",
            "444444"
        ],
        "secondaryContactIds": [
            22,
            24
        ]
    }
}
```

## Contributing

Contributions are welcome! If you find any issues or want to enhance the project, please submit a pull request or open an issue on the project repository.

## License

This project is licensed under the **MIT License**. Feel free to use and modify it as per your needs.
