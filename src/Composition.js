import { Composition } from "remotion";
const calculateMetadata = () => {
    return {};
};
export const MyComposition = () => {
    return (<Composition id="MyComp" component={MyComponent} durationInFrames={60} fps={30} width={1280} height={720} calculateMetadata={calculateMetadata}/>);
};
export const MyComponent = () => {
    return null;
};
