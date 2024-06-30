package sample;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

public class CsvUtil {
	//csvファイルの一列のみ取得するメソッド
		public static String[] csvDataRead(String name,int param) {
			String[][] csvOut = new String[1000][100];
			String[] csvColumnData = new String[3000];

			try {
				File f = new File(name);
				//ファイルパスを取得する
				String str = f.getAbsolutePath();
				FileInputStream input = new FileInputStream(f);
	            InputStreamReader stream = new InputStreamReader(input,"SJIS");
	            BufferedReader br = new BufferedReader(stream);
				String line;
				String[] data;
				//1列名(一列目は列名)を読み込む
				br.readLine();
				int cnt = 0;
				// 1行ずつCSVファイルを読み込む
				while ((line = br.readLine()) != null) {
					data = line.split(",", 0);
					byte[] b = line.getBytes();
	                line = new String(b, "UTF-8");// 行をカンマ区切りで配列に変換
					if(data[param] == null) {
						data[param] ="";
					}
	                csvColumnData[cnt] = data[param];
						System.out.println("読み込みcsvデータ："+csvColumnData[cnt]);
						cnt++;
				}
				br.close();

			} catch (IOException e) {
				csvColumnData[0] = "error";
				System.out.println(e.getMessage());

			} finally {
				return csvColumnData;
			}
		}
		//csvファイルの一行を書き込み(最終行に追加)
		public static void csvOneWrite(String name,String insStr) {
			try {
				File f = new File(name);
				FileWriter f_out = new FileWriter(name,true);
	            PrintWriter p = new PrintWriter(new BufferedWriter(f_out));
	            FileInputStream input = new FileInputStream(f);
	            InputStreamReader stream = new InputStreamReader(input,"SJIS");
	            BufferedReader br = new BufferedReader(stream);
				String line;
				String[] data;
				//1列名(一列目は列名)を読み込む
				br.readLine();
				int cnt = 0;
				// 1行ずつCSVファイルを読み込む
				while (true) {
					if((line = br.readLine()) == null) {
						p.print(insStr);
						break;
					}
					if(cnt >= 10000) {
						System.out.println("無限ループエラー。最大エラー");
						break;

					}
					cnt++;
				}
				br.close();

			} catch (IOException e) {
				System.out.println(e);

			}
		}
		//csvファイルの最大行数を求める
		//例外:lineCnt = -10
		public static int csvCnt(String name) {
			int lineCnt =0;
			try {
				File f = new File(name);
				//ファイルパスを取得する
				String str = f.getAbsolutePath();
				FileInputStream input = new FileInputStream(f);
	            InputStreamReader stream = new InputStreamReader(input,"SJIS");
	            BufferedReader br = new BufferedReader(stream);
				String line;
				String[] data;

				//1列名(一列目は列名)を読み込む
				br.readLine();
				int cnt = 0;
				// 1行ずつCSVファイルを読み込む
				while ((line = br.readLine()) != null) {
					lineCnt++;
				}
				br.close();

			} catch (IOException e) {
				System.out.println(e.getMessage());
				lineCnt = -10;

			} finally {
				return lineCnt;
			}
		}

		//csvファイルの一行を書き込み(最終行に追加、配列全ての値)
				public static void csvArrWrite(String name,String[] insStrArr,int arrCnt) {
					try {
						File f = new File(name);
						FileWriter f_out = new FileWriter(name,true);
			            PrintWriter p = new PrintWriter(new BufferedWriter(f_out));
			            FileInputStream input = new FileInputStream(f);
			            InputStreamReader stream = new InputStreamReader(input,"SJIS");
			            BufferedReader br = new BufferedReader(stream);
						String line;
						String[] data;
						//1列名(一列目は列名)を読み込む
						br.readLine();
						int cnt = 0;
						// 1行ずつCSVファイルを読み込む
						while (true) {
							if((line = br.readLine()) == null) {
								for(int i =0; i < arrCnt;i++) {
									p.print(insStrArr[i]);
								}
								break;
							}
							if(cnt >= 10000) {
								System.out.println("無限ループエラー。最大エラー");
								break;

							}
							cnt++;
						}
						br.close();

					} catch (IOException e) {
						System.out.println(e);

					}
				}

}
