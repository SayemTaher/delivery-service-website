import Banner from "./Banner";
import Featured from "./Featured";


const Home = () => {
    return (
        <div className="flex flex-col">
            <Banner></Banner>
            <Featured></Featured>
            
        </div>
    );
};

export default Home;