import Banner from "./Banner";
import Featured from "./Featured";
import Statistics from "./Statistics";


const Home = () => {
    return (
        <div className="flex flex-col">
            <Banner></Banner>
            <Featured></Featured>
            <Statistics></Statistics>
            
        </div>
    );
};

export default Home;