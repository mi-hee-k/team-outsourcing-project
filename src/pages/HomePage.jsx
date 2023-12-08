import React, {useEffect} from 'react';

import styled, {css} from 'styled-components';
import AddNew from '../components/AddNew';
import {useNavigate} from 'react-router';
import {db} from '../shared/firebase';
import {collection, getDocs} from '@firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setList} from '../redux/modules/fixList';
import {auth} from '../shared/firebase';
const {kakao} = window;

export default function Homepage() {
  const navigate = useNavigate();
  const {isLogin, displayName, uid, photoURL, email} = useSelector(state => state.auth);
  // console.log('이게 이즈로긴', isLogin);
  // const [docs, setDocs] = useState([]);
  // const addlist = useSelector(state => state.list);
  const list = useSelector(state => state.fixList);
  const dispatch = useDispatch();
  // console.log('이게 리스트', addlist);

  useEffect(() => {
    const dataReading = async () => {
      const querySnapshot = await getDocs(collection(db, 'fixs'));
      let dataArr = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();

        console.log(data, ' 이게 독 아이디');
        dataArr.push({...data, id: doc.id});

        // console.log(data.createdAt, '이게그거');
        dataArr = dataArr.sort((a, b) => b.createdAt - a.createdAt);
      });

      dispatch(setList(dataArr));
    };
    // console.log('리랜더링 되니?');
    dataReading();
  }, []);

  return (
    <Body>
      <Fixbar>
        <span>최근Fix한곳</span>
        {isLogin ? <AddNew /> : <></>}
      </Fixbar>
      <ListWrapper>
        {list.map(item => {
          return (
            <List key={item.id} onClick={() => navigate(`/detail/${item.id}`)}>
              <PhotoWrapper>
                <img src={item.image_url} alt="" />
              </PhotoWrapper>
              <UserInfo>
                <Avatar>
                  {' '}
                  <img src={item.photoURL} alt="" />
                </Avatar>
                <NicknameAndDate>
                  <p>{item.displayName}</p>

                  <time>{item.date}</time>
                </NicknameAndDate>
              </UserInfo>
              <Content>
                <span>제목:</span>
                {item.title}
                <br /> <span>내용:</span>
                {item.content}
                {/* {item.createdAt.seconds} */}
              </Content>
            </List>
          );
        })}
      </ListWrapper>
    </Body>
  );
}
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Fixbar = styled.div`
  height: 100px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
  font-size: 30px;
`;

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, auto));
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: 10px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 100%;
  background-color: white;
  border-radius: 10px;

  overflow: hidden;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;

  width: 25vw;
  height: 300px;
  border-radius: 10px;
  margin: 0 10px;
  background-color: var(--light-blue);
  margin: 20px;
  padding: 10px;

  &:hover {
    cursor: pointer;
    transform: scale(1.02);
    transition: all 0.2s;
  }
`;

const UserInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const NicknameAndDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Content = styled.p`
  background-color: var(--beige);
  border-radius: 12px;
  padding: 12px;
  height: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Avatar = styled.figure`
  background-color: white;
  ${props => {
    switch (props.size) {
      case 'large':
        return css`
          width: 75px;
          height: 75px;
        `;
      default:
        return css`
          width: 50px;
          height: 50px;
        `;
    }
  }}

  border-radius: 50%;
  overflow: hidden;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
// :root {
//   --deep-blue: #39a7ff;
//   --blue: #87c4ff;
//   --light-blue: #e0f4ff;
//   --beige: #ffeed9;
//   --black: #000;
//   --white: #fff;
// }
