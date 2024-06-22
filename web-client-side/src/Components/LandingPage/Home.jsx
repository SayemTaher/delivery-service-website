import { Helmet } from "react-helmet-async";
import Banner from "./Banner";
import Featured from "./Featured";
import Statistics from "./Statistics";
import TopDelivery from "./TopDelivery";


const Home = () => {
    return (
        <div className="flex flex-col">
            <Helmet>
                <title>Fast Track | Home</title>
            </Helmet>
            <Banner></Banner>
            <Featured></Featured>
            <Statistics></Statistics>
            <TopDelivery></TopDelivery>
            
        </div>
    );
};

export default Home;