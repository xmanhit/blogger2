import { AxiosError, AxiosResponse } from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GetArticleFollowingUsers, GetArticles, IArticle } from '../../models'
import {
  getArticleFollowingUsers,
  getArticles,
} from '../../services/article.service'
import {
  setArticleFollowingUsersRequest,
  setArticlesFailure,
  setArticlesRequest,
  setArticlesSuccess,
} from '../slices/article.slice'

// Actions
function* handleSetArticleFollowingUsers(
  action: ReturnType<typeof setArticleFollowingUsersRequest>
) {
  try {
    const response: AxiosResponse<IArticle[]> =
      yield call<GetArticleFollowingUsers>(
        getArticleFollowingUsers,
        action.payload
      )

    yield put(setArticlesSuccess(response.data))
  } catch (error) {
    const { response } = error as AxiosError
    yield put(setArticlesSuccess(response?.data))
  }
}
function* handleSetArticles(action: ReturnType<typeof setArticlesRequest>) {
  try {
    const response: AxiosResponse<{
      articles: IArticle[]
      articlesCount: number
    }> = yield call<GetArticles>(getArticles, action.payload)
    yield put(setArticlesSuccess(response.data))
  } catch (error) {
    const { response } = error as AxiosError
    yield put(setArticlesFailure(response?.data))
  }
}

// Watchers
export function* watchSetArticles() {
  yield takeLatest(setArticlesRequest, handleSetArticles)
}
export function* watchSetArticleFollowingUsers() {
  yield takeLatest(
    setArticleFollowingUsersRequest,
    handleSetArticleFollowingUsers
  )
}
