import { Row, Col, Slider, InputNumber } from 'antd';

interface DecimalStepProps {
  value?: number;
  onChange?: (newValue: number) => void;
}

// 自动继承上级的props用以填充 DecimalStepProps 中的属性
// 当然也可以从外部传入
export const DecimalStep: React.FC<DecimalStepProps> = props => {
  const onChange = (value: number | null) => {
    if (value === null) {
      return;
    }
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Row>
        <Col span={12}>
          <Slider
            min={0}
            max={2}
            onChange={onChange}
            value={props.value}
            step={0.01}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={2}
            style={{ margin: '0 16px' }}
            step={0.01}
            value={props.value}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};
