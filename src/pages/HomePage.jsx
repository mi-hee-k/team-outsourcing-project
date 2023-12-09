import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import AddNew from '../components/AddNew';
import {useNavigate} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {Update, useUpdate} from '../components/UI/CustomHook';
import {useReadFirestore} from '../components/UI/CustomHook';
import {DataReading} from '../components/UI/CustomHook';
import {setList} from '../redux/modules/fixList';
import {auth} from '../shared/firebase';
import {collection, addDoc, setDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {db} from '../shared/firebase';
export default function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isLogin, displayName, uid, photoURL, email} = useSelector(state => state.auth);
  const list = useSelector(state => state.fixList);
  useReadFirestore();
  const filteredList = list.filter(item => {
    return item.uid == auth.currentUser.uid;
  });
  const dataReading = async () => {
    const querySnapshot = await getDocs(collection(db, 'fixs'));
    let dataArr = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();

      // console.log(data, ' 이게 독 아이디');
      dataArr.push({...data, id: doc.id});

      // console.log(data.createdAt, '이게그거');
      dataArr = dataArr.sort((a, b) => b.createdAt - a.createdAt);
    });

    dispatch(setList(dataArr));
  };

  return (
    <Body>
      <button onClick={() => Update(photoURL, displayName, filteredList, dispatch, dataReading)}>테스트 버튼</button>
      <Fixbar>
        <span>최근 Fix 한 곳</span>
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
                <h1>{item.title}</h1>
                <h3>{item.addrInput}</h3>
                <h2>{item.content}</h2>
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
  padding: 0px 150px;
  font-size: 30px;
  & span {
    font-weight: 600;
  }
`;

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 80%;
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

  width: 300px;
  height: 400px;
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
  margin: 10px auto;
`;

const NicknameAndDate = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 3px;
  gap: 6px;
  & p {
    font-size: 20px;
  }
  & time {
    font-size: 12px;
    color: gray;
  }
`;

const Content = styled.div`
  background-color: var(--beige);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 10px;
  height: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  gap: 5px;
  & h1 {
    font-size: 20px;
    border-bottom: 1px solid gray;
    padding-bottom: 5px;
  }
  & h2 {
    font-size: 15px;

    padding-bottom: 5px;
    height: 40%;
  }
  & h3 {
    font-size: 10px;
    color: gray;
  }
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
          width: 55px;
          height: 55px;
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
