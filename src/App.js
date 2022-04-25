
import './App.css';
import New from './dummycomponent/New';
import Card from './dummycomponent/Card'
function App() {
  return (
    <div
        class="background_image"
        style={{
          backgroundImage: 'url("https://th.bing.com/th/id/OIP.nfpQv_isCYml-SajqDk-LQHaEo?pid=ImgDet&rs=1")',
          backgroundSize: "cover",
          height: "100vh",
          color: "#f5f5f5"
        }}
      >
      {/* <img src="https://th.bing.com/th/id/OIP.nfpQv_isCYml-SajqDk-LQHaEo?pid=ImgDet&rs=1" alt="..."/> */}
      <New></New>
      <Card></Card>
    </div>
  );
}

export default App;
