//Atcoderの以下の競プロの問題の回答
//atcoder: ABC016 C
//https://atcoder.jp/contests/abc016/tasks/abc016_3

import java.util.Scanner;

public class Atcoder_016C {

	public static void main(String[] args) {

		int n = 0;
		int m = 0;

		Scanner sc = new Scanner(System.in);
		n = sc.nextInt();
		m = sc.nextInt();
		sc.nextLine();

		int[] a_i = new int[m];
		int[] b_i = new int[m];
		int[][] fArr = new int[n][n];
		int[][] ffArr = new int[n][n];
		int[] sum = new int[n];
		int[][] index = new int[n][m];
		int cnt = 0;

		//入力
		for (int i = 0; i < m; i++) {
			a_i[i] = sc.nextInt();
			b_i[i] = sc.nextInt();
			sc.nextLine();
		}

		//友達を探す
		for (int i = 0; i < n; i++) {

			for (int j = 0; j < m; j++) {

				
				if (i + 1 == a_i[j]) {

					fArr[i][b_i[j] - 1] = 1;

				} else if (i + 1 == b_i[j]) {
					fArr[i][a_i[j] - 1] = 1;
				}

			}

		}

		//友達の友達を探す
		for (int i = 0; i < n; i++) {

			for (int j = 0; j < m; j++) {

				//友達の友達を求める(i+1!=b_i[j]:友達の友達が自分自身の時を除く)

				if (fArr[i][a_i[j] - 1] == 1 && i + 1 != b_i[j]) {

					ffArr[i][b_i[j] - 1] = 1;

					//友達の友達を求める(i+1!=a_i[j]:友達の友達が自分自身の時を除く)
				} else if (fArr[i][b_i[j] - 1] == 1 && i + 1 != a_i[j]) {
					ffArr[i][a_i[j] - 1] = 1;
				}

			}
		}
		//友達の友達に友達は含まない
		for (int a = 0; a < n; a++) {
			for (int b = 0; b < n; b++) {
				if (fArr[a][b] == 1) {
					//友達は友達の友達から除く
					if (ffArr[a][b] == 1) {
						ffArr[a][b] = 0;
					}
				}
			}
		}

		//友達の友達の数を出力
		for (int i2 = 0; i2 < n; i2++) {
			for (int j = 0; j < n; j++) {
				sum[i2] = sum[i2] + ffArr[i2][j];

			}
			System.out.println(sum[i2]);
		}

	}

}
