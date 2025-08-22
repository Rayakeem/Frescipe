import mongoose, { Document, Schema } from 'mongoose';

// 팔로우 관계 모델
export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;     // 팔로우하는 사용자
  following: mongoose.Types.ObjectId;    // 팔로우받는 사용자
  status: 'pending' | 'accepted' | 'blocked'; // 상태
  createdAt: Date;
  updatedAt: Date;
}

const FollowSchema = new Schema<IFollow>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'accepted'
  }
}, {
  timestamps: true
});

// 복합 인덱스 (중복 팔로우 방지)
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model<IFollow>('Follow', FollowSchema);

// 댓글 모델
export interface IComment extends Document {
  // 기본 정보
  author: mongoose.Types.ObjectId;       // 작성자
  authorName: string;                    // 작성자 이름 (검색 최적화)
  content: string;                       // 댓글 내용
  
  // 대상 정보
  targetType: 'recipe' | 'comment';      // 댓글 대상 타입
  targetId: mongoose.Types.ObjectId;     // 대상 ID
  
  // 계층 구조 (대댓글)
  parentComment?: mongoose.Types.ObjectId; // 부모 댓글 ID
  depth: number;                         // 댓글 깊이 (0: 원댓글, 1: 대댓글, ...)
  
  // 소셜 기능
  likes: mongoose.Types.ObjectId[];      // 좋아요한 사용자들
  replies: mongoose.Types.ObjectId[];    // 대댓글들
  
  // 상태
  isEdited: boolean;                     // 수정 여부
  isDeleted: boolean;                    // 삭제 여부 (소프트 삭제)
  isReported: boolean;                   // 신고 여부
  
  // 미디어
  images?: string[];                     // 첨부 이미지
  
  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
}

const CommentSchema = new Schema<IComment>({
  // 기본 정보
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // 대상 정보
  targetType: {
    type: String,
    enum: ['recipe', 'comment'],
    required: true,
    index: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  
  // 계층 구조
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  depth: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // 최대 3단계까지만 허용
  },
  
  // 소셜 기능
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // 상태
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  
  // 미디어
  images: [String],
  
  // 메타데이터
  editedAt: Date
}, {
  timestamps: true
});

// 인덱스 설정
CommentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

// 알림 모델
export enum NotificationType {
  RECIPE_LIKE = 'recipe_like',           // 레시피 좋아요
  RECIPE_COMMENT = 'recipe_comment',     // 레시피 댓글
  COMMENT_REPLY = 'comment_reply',       // 댓글 답글
  COMMENT_LIKE = 'comment_like',         // 댓글 좋아요
  FOLLOW_REQUEST = 'follow_request',     // 팔로우 요청
  FOLLOW_ACCEPT = 'follow_accept',       // 팔로우 수락
  RECIPE_FEATURED = 'recipe_featured',   // 레시피 추천 선정
  EXPIRY_REMINDER = 'expiry_reminder',   // 유통기한 알림
  LOW_QUANTITY = 'low_quantity',         // 재료 부족 알림
  WEEKLY_REPORT = 'weekly_report',       // 주간 리포트
  SYSTEM_ANNOUNCEMENT = 'system_announcement' // 시스템 공지
}

export interface INotification extends Document {
  // 기본 정보
  recipient: mongoose.Types.ObjectId;    // 알림 받는 사용자
  sender?: mongoose.Types.ObjectId;      // 알림 보낸 사용자 (시스템 알림의 경우 null)
  
  // 알림 내용
  type: NotificationType;
  title: string;                         // 알림 제목
  message: string;                       // 알림 내용
  
  // 관련 데이터
  relatedId?: mongoose.Types.ObjectId;   // 관련 객체 ID (레시피, 댓글 등)
  relatedType?: string;                  // 관련 객체 타입
  
  // 상태
  isRead: boolean;                       // 읽음 여부
  isClicked: boolean;                    // 클릭 여부
  
  // 추가 데이터
  data?: any;                           // 추가 데이터 (JSON)
  
  // 메타데이터
  createdAt: Date;
  readAt?: Date;
  clickedAt?: Date;
}

const NotificationSchema = new Schema<INotification>({
  // 기본 정보
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // 알림 내용
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // 관련 데이터
  relatedId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  relatedType: String,
  
  // 상태
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  isClicked: {
    type: Boolean,
    default: false
  },
  
  // 추가 데이터
  data: Schema.Types.Mixed,
  
  // 메타데이터
  readAt: Date,
  clickedAt: Date
}, {
  timestamps: true
});

// 인덱스 설정
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// 신고 모델
export enum ReportType {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',   // 부적절한 내용
  SPAM = 'spam',                                    // 스팸
  HARASSMENT = 'harassment',                        // 괴롭힘
  COPYRIGHT = 'copyright',                          // 저작권 침해
  MISINFORMATION = 'misinformation',                // 잘못된 정보
  VIOLENCE = 'violence',                            // 폭력적 내용
  HATE_SPEECH = 'hate_speech',                      // 혐오 발언
  FAKE_ACCOUNT = 'fake_account',                    // 가짜 계정
  OTHER = 'other'                                   // 기타
}

export interface IReport extends Document {
  // 신고자 정보
  reporter: mongoose.Types.ObjectId;     // 신고자
  
  // 신고 대상
  targetType: 'user' | 'recipe' | 'comment'; // 신고 대상 타입
  targetId: mongoose.Types.ObjectId;     // 신고 대상 ID
  targetUserId?: mongoose.Types.ObjectId; // 신고 대상 사용자 (컨텐츠의 작성자)
  
  // 신고 내용
  type: ReportType;
  reason: string;                        // 신고 사유
  description?: string;                  // 상세 설명
  
  // 증거 자료
  evidence?: string[];                   // 증거 이미지/링크
  
  // 처리 상태
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  
  // 처리 정보
  assignedTo?: mongoose.Types.ObjectId;  // 담당 관리자
  resolution?: string;                   // 처리 결과
  resolvedAt?: Date;                     // 처리 완료일
  
  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  // 신고자 정보
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // 신고 대상
  targetType: {
    type: String,
    enum: ['user', 'recipe', 'comment'],
    required: true,
    index: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // 신고 내용
  type: {
    type: String,
    enum: Object.values(ReportType),
    required: true,
    index: true
  },
  reason: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  
  // 증거 자료
  evidence: [String],
  
  // 처리 상태
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  },
  
  // 처리 정보
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: String,
  resolvedAt: Date
}, {
  timestamps: true
});

// 복합 인덱스 (중복 신고 방지)
ReportSchema.index({ reporter: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Report = mongoose.model<IReport>('Report', ReportSchema);

// 활동 로그 모델 (사용자 행동 추적)
export enum ActivityType {
  RECIPE_VIEW = 'recipe_view',           // 레시피 조회
  RECIPE_LIKE = 'recipe_like',           // 레시피 좋아요
  RECIPE_BOOKMARK = 'recipe_bookmark',   // 레시피 북마크
  RECIPE_SHARE = 'recipe_share',         // 레시피 공유
  RECIPE_CREATE = 'recipe_create',       // 레시피 작성
  RECIPE_UPDATE = 'recipe_update',       // 레시피 수정
  COMMENT_CREATE = 'comment_create',     // 댓글 작성
  FOLLOW = 'follow',                     // 팔로우
  SEARCH = 'search',                     // 검색
  FRIDGE_ADD = 'fridge_add',            // 냉장고 재료 추가
  FRIDGE_USE = 'fridge_use',            // 냉장고 재료 사용
  LOGIN = 'login',                       // 로그인
  PROFILE_UPDATE = 'profile_update'      // 프로필 업데이트
}

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;      // 사용자 ID
  type: ActivityType;                   // 활동 타입
  
  // 관련 데이터
  targetType?: string;                  // 대상 타입
  targetId?: mongoose.Types.ObjectId;   // 대상 ID
  
  // 추가 정보
  metadata?: any;                       // 추가 메타데이터
  
  // 세션 정보
  sessionId?: string;                   // 세션 ID
  userAgent?: string;                   // 사용자 에이전트
  ipAddress?: string;                   // IP 주소
  
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(ActivityType),
    required: true,
    index: true
  },
  
  // 관련 데이터
  targetType: String,
  targetId: Schema.Types.ObjectId,
  
  // 추가 정보
  metadata: Schema.Types.Mixed,
  
  // 세션 정보
  sessionId: String,
  userAgent: String,
  ipAddress: String
}, {
  timestamps: { createdAt: true, updatedAt: false } // 활동 로그는 수정되지 않음
});

// 인덱스 설정
ActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
ActivitySchema.index({ targetType: 1, targetId: 1 });
ActivitySchema.index({ createdAt: -1 }); // TTL 인덱스 (90일 후 자동 삭제)

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

// 소셜 서비스 클래스
export class SocialService {
  // 팔로우 관련
  static async followUser(followerId: mongoose.Types.ObjectId, followingId: mongoose.Types.ObjectId) {
    if (followerId.equals(followingId)) {
      throw new Error('Cannot follow yourself');
    }
    
    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    if (existingFollow) {
      throw new Error('Already following this user');
    }
    
    const follow = new Follow({
      follower: followerId,
      following: followingId,
      status: 'accepted' // 기본적으로 바로 승인 (프라이빗 계정의 경우 pending)
    });
    
    return follow.save();
  }
  
  static async unfollowUser(followerId: mongoose.Types.ObjectId, followingId: mongoose.Types.ObjectId) {
    return Follow.deleteOne({ follower: followerId, following: followingId });
  }
  
  static async getFollowers(userId: mongoose.Types.ObjectId) {
    return Follow.find({ following: userId, status: 'accepted' })
      .populate('follower', 'username displayName profileImage')
      .sort({ createdAt: -1 });
  }
  
  static async getFollowing(userId: mongoose.Types.ObjectId) {
    return Follow.find({ follower: userId, status: 'accepted' })
      .populate('following', 'username displayName profileImage')
      .sort({ createdAt: -1 });
  }
  
  // 알림 관련
  static async createNotification(data: Partial<INotification>) {
    const notification = new Notification(data);
    return notification.save();
  }
  
  static async markNotificationAsRead(notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }
  
  static async getUnreadNotifications(userId: mongoose.Types.ObjectId) {
    return Notification.find({ recipient: userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(50);
  }
  
  // 활동 로그
  static async logActivity(userId: mongoose.Types.ObjectId, type: ActivityType, data?: any) {
    const activity = new Activity({
      userId,
      type,
      ...data
    });
    return activity.save();
  }
}
