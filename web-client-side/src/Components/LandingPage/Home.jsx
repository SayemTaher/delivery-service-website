import Banner from "./Banner";
import Featured from "./Featured";
import Statistics from "./Statistics";
import TopDelivery from "./TopDelivery";


const Home = () => {
    return (
        <div className="flex flex-col">
            <Banner></Banner>
            <Featured></Featured>
            <Statistics></Statistics>
            <TopDelivery></TopDelivery>
            
        </div>
    );
};

export default Home;