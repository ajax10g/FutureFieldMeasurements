/*
 * Axiomtek ICO300 API Library
 * User-Mode Driver	
 * Wrote by joechen@axiomtek.com.tw
 */

/* Library ==> /usr/lib/libico300.so.1.0.0 */

/****************************************************/
/* Hardware Monitor Function                        */
int ICO300_read_vcore(float *read_v);
int ICO300_read_5v(float *read_v);
int ICO300_read_vsm(float *read_v);
int ICO300_read_5vsb(float *read_v);
int ICO300_read_sys_temp(unsigned char *data);
int ICO300_read_cpu_temp(unsigned char *date);
int ICO300_read_aux_temp(unsigned char *data);
/****************************************************/
/* int scale : input time scale select 0:sec 1:min  */
/* timeout: range 0~255	                            */
/* Return -1 ,WDT enable failure                    */
/* otherwise, WDT enable success                    */
int ICO300_WDT_enable(unsigned char scale, unsigned char timeout);
/****************************************************/
/* disable the WDT timer                            */
int ICO300_WDT_disable(void);
/****************************************************/
/* reload the WDT timer                             */
int ICO300_WDT_reload(void);
/****************************************************/
/* read the WDT current setting value               */
/* return -1, the WDT not setting/enable yet        */
/* otherwise, the value store in *sec               */
int ICO300_read_WDT_config(unsigned int *time);
/****************************************************/
/* number: 1,2					    */
/* type: RS232=1  RS422/RS485_4W=2  RS485_2W=3	    */
int ICO300_set_comport(int number, int type);
/****************************************************/
/* mode: bit x:DIO port x			    */
/* bit value : 1:input mode, 0:output mode	    */
void ICO300_set_DIO_mode(unsigned char mode);
/****************************************************/
void ICO300_print_DIO_status();
/****************************************************/
void ICO300_set_DO(unsigned char value);
/****************************************************/
void ICO300_get_DO(unsigned char *value);
/****************************************************/
void ICO300_get_DI(unsigned char *value);

