import { Panel } from "rsuite";
function InternshipCard(props) {
  return (
    <Panel className="reviewCard" bordered header={props.companies.name}>
      <p>{props.ended.slice(0, 7)}</p>
      <p>{props.rating} / 5</p>
      <p>{props.description}</p>
    </Panel>
  );
}

export default InternshipCard;
