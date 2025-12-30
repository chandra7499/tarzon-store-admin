const Form = ({ handleFn, children, ...props }) => {
  return (
    <>
      <form onSubmit={handleFn} {...props}>
        {children}
      </form>
    </>
  );
};

export default Form;
