import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

const Loader = () => {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
};

export default Loader;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;
