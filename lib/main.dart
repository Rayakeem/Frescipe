import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';

import 'core/app/app.dart';
import 'core/config/firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Firebase 초기화 임시 비활성화 - 나중에 Firebase 프로젝트 설정 후 활성화
  // try {
  //   await Firebase.initializeApp(
  //     options: DefaultFirebaseOptions.currentPlatform,
  //   );
  // } catch (e) {
  //   print('Firebase 초기화 실패: $e');
  // }
  
  runApp(
    const ProviderScope(
      child: FrescipeApp(),
    ),
  );
}
