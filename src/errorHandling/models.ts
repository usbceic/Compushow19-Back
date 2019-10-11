interface ErrorObjectInterface {
  status: number;
  title: string;
  message: string;
  userMessage: string;
  errors?: ErrorDetailInterface[];
}

interface ErrorDetailInterface {
  field: string;
  validationCode: string;
}

export default ErrorObjectInterface
export {
  ErrorDetailInterface
}
