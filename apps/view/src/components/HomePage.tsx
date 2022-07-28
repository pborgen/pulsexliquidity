import Header from './Header';
import Social from './Social';
import Footer from './Footer';
import Grid from './Grid';
import TopHeading from './TopHeading';
import Technology from './Technology';


type Props = {

};


const HomePage = ({ }: Props) => {
    return (
        <>
            <Header></Header>
            <TopHeading></TopHeading>
            <Grid></Grid>

            <Social></Social>
            <Technology></Technology>
            <Footer></Footer>
        </>
    );
};

export default HomePage; 