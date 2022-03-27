import React, { useState } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import { swap } from "../api/TradeCenter";

interface Props {
  open: boolean;
  onClose: (event?: any) => void;
}

interface SubmitTxParams {
    value
}

const CreateTxModal: React.FC<Props> = ({ open, onClose }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { pending, error, call } = useAsync<SubmitTxParams, any>(
    async (params) => {
      if (!web3) {
        throw new Error("No web3");
      }

      await swap(web3, account, params);
    }
  );

  const [inputs, setInputs] = useState({
    to: "",
    value: 0,
    data: "",
  });

  function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({
      ...inputs,
      [name]: e.target.value,
    });
  }

  async function onSubmit() {
    if (pending) {
      return;
    }

    const { error } = await call({
      ...inputs,
      value: inputs.value.toString(),
    });

    if (!error) {
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Swap from built in wallet</Modal.Header>
      <Modal.Content>
        {error && <Message error>{error.message}</Message>}
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <label>To</label>
            <Form.Input
              type="text"
              value={inputs.to}
              onChange={(e) => onChange("to", e)}
            />
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Form.Input
              type="number"
              min={0}
              value={inputs.value}
              onChange={(e) => onChange("value", e)}
            />
          </Form.Field>
          <Form.Field>
            <label>Data</label>
            <Form.Input
              value={inputs.data}
              onChange={(e) => onChange("data", e)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button
           
          onClick={onSubmit}
          disabled={pending}
          loading={pending}
        >
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CreateTxModal;
